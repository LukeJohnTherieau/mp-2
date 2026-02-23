import { useState } from 'react'
import DataRetrieval from "./components/DataRetrieval.tsx";
import './App.css'
import type { StationData } from "./interfaces/StationData.ts";
import type { TrainData } from "./interfaces/TrainData.ts";

function App() {
  // useState Hook to store Data.
  const [stations, setStations] = useState<StationData[]>([]);
  const [latitude, setLatitude] = useState<number>(42.3555);
  const [longitude, setLongitude] = useState<number>(71.0565);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <>
      <DataRetrieval stations={stations} setStations={setStations} latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} />

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
              {station.attributes.trains.slice(0, 5).map((train: TrainData, index: number) => (
                <tr key={index}>
                  <td>{`${train.id}`}</td>
                  <td>{`${train.attributes.arrival_time}`}</td>
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
