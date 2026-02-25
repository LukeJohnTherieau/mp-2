import { useState, useEffect } from 'react'
import DataRetrieval from "./components/DataRetrieval.tsx";
import Stations from "./components/Stations.tsx";
import type { StationData } from "./interfaces/StationData.ts";
import './App.css'
import 'leaflet/dist/leaflet.css';


function App() {
  // useState Hook to store Data.
  const [stations, setStations] = useState<StationData[]>([]);
  const [latitude, setLatitude] = useState<number>(42.3555);
  const [longitude, setLongitude] = useState<number>(-71.0565);
  const [callsUsed, setCallsUsed] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [timeDifference, setTimeDifference] = useState<number>(0);

    useEffect(() => {
      return () => {
          if (timeDifference > 60) {
              setStartDate(new Date())
              setCallsUsed(0);
          }
      };
  }, [timeDifference]); // Optional dependency array


  useEffect(() => {
      return () => {
        console.log([latitude,longitude])
      };
  }, [latitude,longitude]); // Optional dependency array
  return (
    <>
      <h1>Five Closest MBTA Stops</h1>
      <DataRetrieval 
      stations={stations} 
      setStations={setStations} 
      latitude={latitude} 
      setLatitude={setLatitude} 
      longitude={longitude} 
      setLongitude={setLongitude} 
      callsUsed={callsUsed} 
      setCallsUsed={setCallsUsed} 
      startDate = {startDate} 
      setStartDate = {setStartDate}
      timeDifference = {timeDifference}
      setTimeDifference = {setTimeDifference}
      />
      <Stations stations={stations}/>
    </>
  )
}
export default App
