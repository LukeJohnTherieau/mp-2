import { useState } from 'react'
import DataRetrieval from "./components/DataRetrieval.tsx";
import './App.css'
import type { StationData } from "./interfaces/StationData.ts";
import type { TrainData } from "./interfaces/TrainData.ts";


function App() {
  // useState Hook to store Data.
  const [stations, setStations] = useState<StationData[]>([]);
  const [latitude, setLatitude] = useState<number>(42.3555);
  const [longitude, setLongitude] = useState<number>(-71.0565);
  const [callsUsed, setCallsUsed] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <>
      <DataRetrieval stations={stations} setStations={setStations} latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} callsUsed={callsUsed} setCallsUsed={setCallsUsed} startDate = {startDate} setStartDate = {setStartDate}/>

      {stations.slice(0, 5).map((station: StationData) => (
        <div>
          <h1>{station.attributes.name}</h1>
          <h2>{formatter.format(station.attributes.distance)}</h2>
          <table>
            <thead>
              <tr>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {station.attributes.trains.filter((train: TrainData) => train.attributes.arrival_time !== null && (train.id.includes("Green") || train.id.includes("Red") || train.id.includes("Blue") || train.id.includes("Orange") || train.id.includes("CR"))).map((train: TrainData, index: number) => (
                <tr key={index}>
                  <td>{`${train.attributes.service}`}</td>
                  <td>{`${train.attributes.line}`}</td>
                  <td>{`${train.attributes.direction}`}</td>
                  <td>{`${Math.ceil(train.attributes.eta)} Min`}</td>
                </tr>
              ))}
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}

export default App
