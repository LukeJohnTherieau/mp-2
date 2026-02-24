export interface Train {
    arrival_time: Date ,
    arrival_uncertainty: number,
    departure_time: Date,
    departure_uncertainty: number,
    direction_id: number,
    direction: string,
    last_trip: boolean,
    revenue: string,
    schedule_relationship: string,
    status: string,
    stop_sequence: number,
    update_type: string,
    eta: number,
    service: string | undefined,
    line: string | undefined
}