import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./util";
function App() {
  //State to set all the countries as the menuItem
  const [countries, setCountries] = useState([]);
  //State to set default menuItem
  const [country, setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 47.500954, lng: 8.729869 });
  const [mapZoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

//STATE = jpw tp write a variable in react
//USEEFFECT = runs a piece of code based on a given condition


useEffect(() => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
}, []);
//STATE=How to write a variable in REACT <<<<<<<
//USEEFFECT= Run a piece of code
//Based on a given condition

useEffect(() => {
  //async -> send a request a server,wait for it and do something with info
  //The Code  inside here will run once
  //when the component loads and not again
  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country, //United State, Japan ,China ,France
          value: country.countryInfo.iso2, //UK,USA,CN,FR
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      });
  };
  getCountriesData();
}, []);

//Stick the selected dropDown Item to the be the default Item
const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  setCountry(countryCode);
  //"https://disease.sh/v3/covid-19/all
  //"https://disease.sh/v3/covid-19/countries"/[COUNTRY_CODE]

  const url =
    countryCode === "WorldWide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      if (countryCode === "WorldWide") {
        setMapCenter(mapCenter);
        setZoom(mapZoom);
      } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      }
    });
};

return (
  <div className="app">
    <div className="app_left">
      <div className="app_header">
        <h1> Covid 19 Tracker </h1>{" "}
        <FormControl className="app_dropdown">
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}
          >
            {/*loop through all the countries and and show dropdown of the options */}
            <MenuItem value="WorldWide"> WorldWide </MenuItem>{" "}
            {countries.map((country) => (
              <MenuItem value={country.value}> {country.name} </MenuItem>
            ))}{" "}
            {/* <MenuItem value="worldwide">worldwode</MenuItem>
           <MenuItem value="worldwide">worldwode</MenuItem>
           <MenuItem value="worldwide">worldwode</MenuItem>
           <MenuItem value="worldwide">worldwode</MenuItem> */}{" "}
          </Select>
        </FormControl>{" "}
      </div>{" "}
      {/*Title+Select input dropdown field */}{" "}
      <div className="app_stats">
        <InfoBox
          isRed
          active={casesType === "cases"}
          onClick={(e) => setCasesType("cases")}
          title="Coronaviurs Cases"
          total={prettyPrintStat(countryInfo.cases)}
          cases={prettyPrintStat(countryInfo.todayCases)}
        />{" "}
        <InfoBox
          active={casesType === "recovered"}
          onClick={(e) => setCasesType("recovered")}
          title="Recovered"
          total={prettyPrintStat(countryInfo.recovered)}
          cases={prettyPrintStat(countryInfo.todayRecovered)}
        />{" "}
        <InfoBox
          isRed
          active={casesType === "deaths"}
          onClick={(e) => setCasesType("deaths")}
          title="Deaths"
          total={prettyPrintStat(countryInfo.deaths)}
          cases={prettyPrintStat(countryInfo.todayDeaths)}
        />{" "}
      </div>{" "}
      <Map
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>{" "}
    <Card className="app_right">
      <CardContent>
        <h3 className="app_rightTableTitle">Live Cases by Country</h3>
        <Table countries={tableData} />
        <h3 className="app_rightGraphTitle">WorldWide New {casesType}</h3>
        <LineGraph className="app_graph" casesType={casesType} />
      </CardContent>
    </Card>
  </div>
);
}

export default App;
