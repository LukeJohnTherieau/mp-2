import styled from "styled-components";
import { useState } from 'react'
import DataRetrieval from "./components/DataRetrieval.tsx";
import Stations from "./components/Stations.tsx";
import type { StationData } from "./interfaces/StationData.ts";
import './App.css'
import 'leaflet/dist/leaflet.css';


const AppTitle = styled.h1`
  color: black;
`;

function App() {
  // useState Hook to store Data.
  const [stations, setStations] = useState<StationData[]>([]);
  return (
    <>
      <AppTitle>Five Closest MBTA Stops</AppTitle>
      <DataRetrieval stations={stations} setStations={setStations}/>
      <Stations stations={stations}/>
    </>
  )
}
export default App