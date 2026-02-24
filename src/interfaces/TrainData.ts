import type {Train} from "./Train.ts";

export interface TrainData{
    id: string;
    type: string;
    links: object;
    relationships: object;
    attributes: Train;
}