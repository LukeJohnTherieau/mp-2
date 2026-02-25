import styled from "styled-components";
import type { TrainData } from "../interfaces/TrainData.ts";


const TrainLineDiv = styled.div`
  margin: 10px;
  font-size: calc(10px + 0.5vw);
  color: black;
  outline: 2px solid black;
  border-radius: 5px 5px 5px 5px;
`;

const TrainLineTitle = styled.h2<{ $name?: string; }>`
color: white;
      padding: 10px;
      border-radius: 5px 5px 0 0;
      background-color: ${(props) => {
    switch (props.$name) {
      case 'Red':
        return '#D62D20';

      case 'Orange':
        return '#E98C0E';

      case 'Blue':
        return '#1E3CA4';

      case 'Green B':
        return '#09843D';

      case 'Green C':
        return '#09843D';

      case 'Green D':
        return '#09843D';

      case 'Green E':
        return '#09843D';

      default:
        return '#7F286C';
    }
  }};
    `;

const TrainsDiv = styled.div`
    flex-direction: column;
    display: flex;
    padding: 10px;
  `;

const TrainDiv = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: center;
  `;
const TrainTable = styled.table`
    text-align: center;
    width: 100%;
    table-layout: fixed; 
  `;

const TrainTd = styled.td`
    text-align: left;
  `;

export default function Trains(props: { name: string, train: TrainData[] }) {
  return (
    <TrainLineDiv>
      <TrainLineTitle $name={props.name}>{props.name}</TrainLineTitle>
      <TrainsDiv>
        {props.train.map((train: TrainData) => (
          <TrainDiv>
          <TrainTable>
            <tbody>
              <tr>
                <TrainTd>{train.attributes.direction}</TrainTd>
                <TrainTd>{`${Math.ceil(train.attributes.eta)} min`}</TrainTd>
                <TrainTd>{train.attributes.update_type}</TrainTd>
              </tr>
            </tbody>
          </TrainTable>
          </TrainDiv>
        ))}
      </TrainsDiv>
    </TrainLineDiv>
  );
}