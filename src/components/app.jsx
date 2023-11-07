import {LaunchList} from "./launchList";
import {Map, launchpads, projection, width, height, margin, svg} from "./map";
import {useEffect, useState} from "react";
import {SpaceX} from "../api/spacex";

function handleMouseEnter(launch){
    launchpads.forEach(launchpad => {
        if (launchpad.id === launch.launchpad) {
            coords = projection([launchpad.longitude, launchpad.latitude])
            circle = document.getElementById("flypoint");
            circle.setAttribute("cx", coords[0]);
            circle.setAttribute("cy", coords[1]);
        }
    })
}

function App(){
    
    const [launches, setLaunches] = useState([]);
    const spacex = new SpaceX();
    useEffect(()=>{
        spacex.launches().then(data =>{
            setLaunches(data)
        })
    },[])

    return(
        <main className='main'>
            <LaunchList launches = {launches}/>
            <Map/>
        </main>
    )
}

export {App, handleMouseEnter};
