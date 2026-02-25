import styled from "styled-components";
import type { StationData } from "../interfaces/StationData.ts";
import Trains from "./Trains.tsx";

const StationDiv = styled.div`
  padding: 4px;
  margin: 10px;
  font-size: calc(10px + 0.5vw);
  color: black;
  outline: 2px solid black;
  border-radius: 5px 5px 5px 5px;
`;

const StationSpan = styled.span`
  font-size: calc(7px + 0.5vw);
  color: black;
`;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function Stations(props: { stations: StationData[] }) {
    return (
        <div>
            {/* Top 5 statices only */}
            {props.stations.slice(0, 5).map((station: StationData) => (
                <StationDiv>
                    <h1>{station.attributes.name} <StationSpan>{`${formatter.format(station.attributes.distance)} mi`}</StationSpan></h1>
                    {Array.from(station.attributes.trains.entries()).map(([name, train]) => (
                        <Trains name={name} train={train} />
                    ))}
                </StationDiv>
            ))}
        </div>
    );
}