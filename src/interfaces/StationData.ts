import type {Station} from "./Station.ts";

export interface StationData{
    id: string;
    type: string;
    links: object;
    relationships: object;
    attributes: Station;
}