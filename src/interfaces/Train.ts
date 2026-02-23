export interface Train {
    arrival_time: Date ,
    arrival_uncertainty: number,
    departure_time: Date,
    departure_uncertainty: number,
    direction_id: number,
    last_trip: boolean,
    revenue: string,
    schedule_relationship: object,
    status: string,
    stop_sequence: number,
    update_type: string
}