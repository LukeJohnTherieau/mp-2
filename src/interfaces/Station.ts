import type {TrainData} from "./TrainData.ts";

export interface Station{
    address: string,
    at_street: string,
    description: string,
    latitude: number,
    location_type: number,
    longitude: number,
    municipality: string,
    name: string,
    on_street: number,
    platform_code: number,
    platform_name: string,
    vehicle_type: number,
    wheelchair_boarding: number,
    distance: number,
    trains: TrainData[]
}