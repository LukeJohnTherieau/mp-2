import type { StationData } from "../interfaces/StationData.ts";
import type { TrainData } from "../interfaces/TrainData.ts";
import { MapContainer, TileLayer, Marker, useMapEvents} from 'react-leaflet'


export default function DataRetrieval(
    props: { 
        stations: StationData[], 
        setStations: React.Dispatch<React.SetStateAction<StationData[]>>, 
        latitude: number, 
        setLatitude: React.Dispatch<React.SetStateAction<number>>, 
        longitude: number, 
        setLongitude: React.Dispatch<React.SetStateAction<number>>, 
        callsUsed: number, 
        setCallsUsed: React.Dispatch<React.SetStateAction<number>>, 
        startDate: Date, 
        setStartDate: React.Dispatch<React.SetStateAction<Date>>,
        timeDifference: number, 
        setTimeDifference: React.Dispatch<React.SetStateAction<number>>
    }
) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    async function fetchTrains(place_id: string): Promise<Map<string, TrainData[]>> {
        const url = `https://api-v3.mbta.com/predictions?filter[stop]=${place_id}`;
        const response = await fetch(url);
        const { data }: { data: TrainData[] } = await response.json();
        const currentDate = new Date();
        const trainLines = new Map<string, TrainData[]>();
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
        return trainLines;
    }
    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
        // distance between latitudes
        // and longitudes
        const dLat = (lat2 - lat1) * Math.PI / 180.0;
        const dLon = (lon2 - lon1) * Math.PI / 180.0;

        // convert to radiansa
        lat1 = (lat1) * Math.PI / 180.0;
        lat2 = (lat2) * Math.PI / 180.0;

        // apply formulae
        const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        const rad = 6371;
        const c = 2 * Math.asin(Math.sqrt(a));
        return rad * c * 0.621371;
    }

    function MyComponent() {
        useMapEvents({
            click(e) {
                fetchStops(e.latlng.lat, e.latlng.lng);
            },
        });
        return null
    }

    async function fetchStops(latitude:number, longitude:number): Promise<void> {
        const timeDifference = (new Date().getTime() - props.startDate.getTime()) / 1000;
        props.setTimeDifference(timeDifference)
        const callsUsed = props.callsUsed;
        console.log(props.callsUsed)
        if (timeDifference <= 60 && callsUsed < 18) {
            const url = `https://api-v3.mbta.com/stops/?filter[latitude]=${latitude}&filter[longitude]=${longitude}&filter[radius]=360&sort=distance&filter[location_type]=1`;
            const response = await fetch(url);
            if (response.status == 429) {
                props.setCallsUsed(callsUsed => callsUsed + 18);
            }
            const { data }: { data: StationData[] } = await response.json();
            for (const station of data) {
                station.attributes.distance = haversine(station.attributes.latitude, station.attributes.longitude, latitude, longitude);
            }
            data.sort((a, b) => a.attributes.distance - b.attributes.distance);
            for (let i = 0; i < 5; i++) {
                data[i].attributes.trains = await fetchTrains(data[i].id);
            }
            props.setCallsUsed(callsUsed => callsUsed + 6);
            props.setStations(data);
            props.setLatitude(latitude);
            props.setLongitude(longitude);
        }
    }
    return (
        <div>
            <h2>{props.callsUsed === 18 ? `Please try again in ${formatter.format(60-props.timeDifference)} Seconds` : ""}</h2>
            <MapContainer center={[props.latitude, props.longitude]} zoom={14} scrollWheelZoom={true} style={{ height: "50vh", width: "100%" }}>
                <MyComponent />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[props.latitude, props.longitude]}>
                </Marker>
            </MapContainer>
        </div>
    );
}