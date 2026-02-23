import type { StationData } from "../interfaces/StationData.ts";
import type { TrainData } from "../interfaces/TrainData.ts";

export default function DataRetrieval(props: { stations: StationData[], setStations: React.Dispatch<React.SetStateAction<StationData[]>>, latitude: number, setLatitude: React.Dispatch<React.SetStateAction<number>>, longitude: number, setLongitude: React.Dispatch<React.SetStateAction<number>> }) {
    async function fetchStops(): Promise<void> {
        const url = `https://api-v3.mbta.com/stops/?filter[latitude]=${props.latitude}&filter[longitude]=${props.longitude}&filter[radius]=360&sort=distance&filter[location_type]=1`;
        const rawData = await fetch(url);
        const { data }: { data: StationData[] } = await rawData.json();
        for (const station of data) {
            station.attributes.distance = haversine(station.attributes.latitude, station.attributes.longitude, props.latitude, props.longitude);
        }
        data.sort((a, b) => a.attributes.distance - b.attributes.distance)
        for (let i = 0; i < 5; i++){
            data[i].attributes.trains = await fetchTrains(data[i].id)
        }
        props.setStations(data);
    }
    async function fetchTrains(place_id: string): Promise<TrainData[]> {
        const url = `https://api-v3.mbta.com/predictions?filter[stop]=${place_id}`;
        const rawData = await fetch(url);
        const { data }: { data: TrainData[] } = await rawData.json();
        return data;
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
    return (
        <div>
            <div>
                <label>Latitude:</label>
                <input type="number" id="latitude" value={props.latitude} onChange={(e) => props.setLatitude(Number(e.target.value))}></input>
            </div>
            <div>
                <label>Longitude:</label>
                <input type="number" id="longitude" value={props.longitude} onChange={(e) => props.setLongitude(Number(e.target.value))}></input>
            </div>
            <button onClick={fetchStops}>Get Stations</button>
        </div>
    );
}