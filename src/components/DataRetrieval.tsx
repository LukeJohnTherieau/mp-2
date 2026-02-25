import styled from "styled-components";
import type { StationData } from "../interfaces/StationData.ts";
import type { TrainData } from "../interfaces/TrainData.ts";
import { MapContainer, TileLayer, Marker, useMapEvents} from 'react-leaflet'
import { useState } from 'react'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from '../assets/MBTA.svg';

const myCustomIcon = new L.Icon({
  iconUrl: customMarkerImage, 
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32], 
});

const ErrorMessage = styled.p`
    color: red;
`;


export default function DataRetrieval(props: { stations: StationData[], setStations: React.Dispatch<React.SetStateAction<StationData[]>>}) {
    const [latitude, setLatitude] = useState<number>(42.3555);
    const [longitude, setLongitude] = useState<number>(-71.0565);
    const [callsUsed, setCallsUsed] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [timeDifference, setTimeDifference] = useState<number>(0);
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    async function fetchTrains(place_id: string): Promise<Map<string, TrainData[]>> {
        const url = `https://api-v3.mbta.com/predictions?filter[stop]=${place_id}`;
        const trainLines = new Map<string, TrainData[]>();
        try {
            const response = await fetch(url);
            const { data }: { data: TrainData[] } = await response.json();
            const currentDate = new Date();
            for (const train of data) {
                let line = "";
                if (train.attributes.arrival_time) {
                    train.attributes.eta = (new Date(train.attributes.arrival_time).getTime() - currentDate.getTime()) / 60000;
                }
                if (train.id.includes("Green") || train.id.includes("CR")) {
                    line = `${train.id.split("-").at(-2)} ${train.id.split("-").at(-1)}`;
                }
                if (train.id.includes("Red") || train.id.includes("Blue") || train.id.includes("Orange")) {
                    line = `${train.id.split("-").at(-1)}`;
                }
                train.attributes.direction = train.attributes.direction_id === 1 ? "Inbound" : "Outbound";

                if (train.attributes.arrival_time !== null && line && train.attributes.eta > 0) {
                    if (trainLines.has(line)) {
                        trainLines.get(line)?.push(train)
                    } else {
                        trainLines.set(line, [train])
                    }
                }
            }

        } catch (e) {
            console.log(e)
            setCallsUsed(18);

        }
        return trainLines;
    }

    function convertToRadians(value:number) {
        return (value) * Math.PI / 180.0
    }

    function distanceBetweenPoints(point1:number, point2:number) {
        return (point2 - point1) * Math.PI / 180.0 / 2;
    }

    function distanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
        return 6371 * 2 * Math.asin(
            Math.sqrt(
                Math.pow(
                    Math.sin(
                        distanceBetweenPoints(lat1, lat2)
                    ), 2
                ) + Math.pow(
                    Math.sin(
                        distanceBetweenPoints(lon1, lon2)
                    ), 2
                ) * Math.cos(
                    convertToRadians(lat1)
                ) * Math.cos(
                    convertToRadians(lat2)
                )
            )
        ) * 0.621371;
    }

    function HandleMapEvent() {
        useMapEvents({
            click(e) {
                fetchStops(e.latlng.lat, e.latlng.lng);
            },
        });
        return null
    }

    async function fetchStops(newLatitude:number, newLongitude:number): Promise<void> {
        const timeDifference = (new Date().getTime() - startDate.getTime()) / 1000;
        setTimeDifference(timeDifference)
        console.log(callsUsed)
        if (timeDifference > 60) {
            setStartDate(new Date())
            setCallsUsed(0);
        }
        if (timeDifference <= 60 && callsUsed < 18) {
            const url = `https://api-v3.mbta.com/stops/?filter[latitude]=${newLatitude}&filter[longitude]=${newLongitude}&filter[radius]=360&sort=distance&filter[location_type]=1`;
            try {
                const response = await fetch(url);
                const { data }: { data: StationData[] } = await response.json();
                for (const station of data) {
                    station.attributes.distance = distanceBetweenCoordinates(station.attributes.latitude, station.attributes.longitude, newLatitude, newLongitude);
                }
                data.sort((a, b) => a.attributes.distance - b.attributes.distance);
                for (let i = 0; i < 5; i++) {
                    data[i].attributes.trains = await fetchTrains(data[i].id);
                }
                setCallsUsed(callsUsed + 6);
                props.setStations(data);
                setLatitude(newLatitude);
                setLongitude(newLongitude);

            } catch(e) {
                console.log(e);
                setCallsUsed(18);

            }
        }
    }
    
    return (
        <div>
            <ErrorMessage>{callsUsed === 18 ? `Please try again in ${formatter.format(60-timeDifference)} Seconds` : ""}</ErrorMessage>
            <MapContainer center={[latitude, longitude]} zoom={14} scrollWheelZoom={true} style={{ height: "50vh", width: "100%" }}>
                <HandleMapEvent />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[latitude, longitude]} icon={myCustomIcon}></Marker>
            </MapContainer>
        </div>
    );
}