import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ confirmeds, date, setTooltipContent }) => {
  if (!confirmeds.length) {
    return "Loading...";
  }
  return (
    <ComposableMap
      height={400}
      projectionConfig={{
        scale: 120
      }}
    >
      <text
        x="200"
        y="30"
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="#000"
      >
        {date}
      </text>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>
      {confirmeds.map(({ name, count, coordinates, key }) => (
        <Marker
          key={key}
          onClick={() => {
            setTooltipContent("BU");
          }}
          coordinates={coordinates}
        >
          <circle r={Math.log2(count)} fill="#F00" fillOpacity="0.7" />
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default MapChart;
