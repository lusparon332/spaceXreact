import * as d3 from "d3";
import * as Geo from "../geo.json";
import {useRef, useEffect} from "react";
import { SpaceX } from "../api/spacex";

const spaceX = new SpaceX();
let launchpads = [];
spaceX.launchpads().then(data => {launchpads = data});

const width = 1000;
const height = 600;
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
};

const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width/2 - margin.left, height/2 - margin.top]);

function Map(props){
    
    const containerRef = useRef(null);
    useEffect(()=> { const svg = d3.select(containerRef.current).append("svg");
        svg.selectAll("*").remove();
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom )
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const g = svg.append("g");

        g.selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", d3.geoPath().projection(projection))
            .style("opacity", .7)

        spaceX.launchpads().then(data=>{
            for (let i = 0; i < data.length; i++) {
                coords = projection([data[i].longitude, data[i].latitude])
                svg.append("circle")
                .attr("cx", coords[0])
                .attr("cy", coords[1])
                .attr("r", 3)
                .attr("fill", "red")
            }
        })

        svg.append("circle")
            .attr("cx", 10000)
            .attr("cy", 10000)
            .attr("r", 7)
            .attr("fill", "green")
            .attr("id", "flypoint")

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function(event) {
                g.selectAll('path')
                    .attr('transform', event.transform);
                svg.selectAll('circle')
                    .attr('transform', event.transform);
            });

        svg.call(zoom); }, []);

    return(
        <div className="mapContainer map" ref={containerRef}>
        </div>
    )
}

export {Map, launchpads, projection, width, height, margin}