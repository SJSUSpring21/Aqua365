import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Navbar, Nav, Row, Col, Image } from "react-bootstrap/esm";
import Button from "../../node_modules/react-bootstrap/Button";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { InputLabel, Select, MenuItem, Dropdown } from "@material-ui/core";
// import Dropdown from 'react-dropdown';
import "./Insights.css";
import "../index.css";

const options = [{ value: "bdo", label: "bdo" }];

const defaultOption = options[0];

function Insights() {
  const location = useLocation();
  const history = useHistory();

  const [avgValue, setAvgValue] = useState(0);

  const [stationCode, setStationCode] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(0);
  const [phLevel, setPhLevel] = useState(0);
  const [conductivity, setConductivity] = useState(0);
  const [bod, setBod] = useState(0);
  const [nitrate, setNitrate] = useState(0);
  const [coliform, setColiform] = useState(0);
  const [year, setYear] = useState(0);

  // Validation text
  const [allValidation, setAllValidation] = useState("");
  const [temperatureValidation, setTemperatureValidation] = useState("");
  const [dissolvedOxygenValidation, setDissolvedOxygenValidation] = useState(
    ""
  );
  const [phLevelValidation, setPhLevelValidation] = useState("");
  const [conductivityValidation, setConductivityValidation] = useState("");
  const [bodValidation, setBodValidation] = useState("");
  const [nitrateValidation, setNitrateValidation] = useState("");
  const [coliformValidation, setColiformValidation] = useState("");
  const [yearValidation, setYearValidation] = useState("");

  //WQI formula
  const [WQI, setWQI] = useState(0);
  const [flag, setFlag] = useState(false);

  //forecasts
  const [bdoForecast, setbdoForecast] = useState([]);
  const [doForecast, setdoForecast] = useState([]);
  const [phForecast, setphForecast] = useState([]);
  const [wcoForecast, setwcoForecast] = useState([]);
  const [wecForecast, setwecForecast] = useState([]);
  const [wnaForecast, setwnaForecast] = useState([]);
  const [forecastData, setforecastData] = useState([]);

  //Header
  const [header, setHeader] = useState(
    "Forecast for Biochemical Demand Oxygen"
  );
  const [header2, setHeader2] = useState(
    "Statistics for Biochemical Demand Oxygen"
  );

  //Label
  const [label, setLabel] = useState("Predicted BDO");


  //Avg values
  const [avgBdo, setavgBdo] = useState(0);
  const [avgCo, setavgCo] = useState(0);
  const [avgDo, setavgDo] = useState(0);
  const [avgEc, setavgEc] = useState(0);
  const [avgNa, setavgNa] = useState(0);
  const [avgPh, setavgPh] = useState(0);
  const [avgWqi, setavgWqi] = useState(0);

  // Percent Diff
  const [percentDiffBdoSinceStart, setpercentDiffBdoSinceStart] = useState(0);
  const [percentDiffCoSinceStart, setpercentDiffCoSinceStart] = useState(0);
  const [percentDiffDoSinceStart, setpercentDiffDoSinceStart] = useState(0);
  const [percentDiffEcSinceStart, setpercentDiffEcSinceStart] = useState(0);
  const [percentDiffNaSinceStart, setpercentDiffNaSinceStart] = useState(0);
  const [percentDiffPhSinceStart, setpercentDiffPhSinceStart] = useState(0);
  const [percentDiffWqiSinceStart, setpercentDiffWqiSinceStart] = useState(0);

  //
  const [percentDiffSinceStart, setpercentDiffSinceStart] = useState(0);

  //Inputs

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    console.log("123");
    console.log(location);
    setforecastData(location.state.bdoForecast);
    setAvgValue(location.state.avgBdo.toFixed(2));
    setpercentDiffSinceStart(
      location.state.percentDiffBdoSinceStart.toFixed(2)
    );
  }, []);

  const data1 = {
    // labels: ['1', '2', '3', '4', '5', '6'],
    labels: ["2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: label,
        // data: [33, 25, 35, 51, 54, 76],
        data: forecastData,
        fill: false,
        backgroundColor: "#003B46",
        borderColor: "#003B46",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  let dropDownChangeHandler = (e) => {
    console.log(e.target.value);
    if (e.target.value == "bdo") {
      setforecastData(location.state.bdoForecast);
      setHeader("Forecast for Biochemical Demand Oxygen");
      setHeader2("Statistics for Biochemical Demand Oxygen");
      setLabel("Predicted BDO");
      setAvgValue(location.state.avgBdo.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffBdoSinceStart.toFixed(2)
      );
    } else if (e.target.value == "do") {
      setforecastData(location.state.doForecast);
      setHeader("Forecast for Dissolved Oxygen");
      setHeader2("Statistics for Dissolved Oxygen");
      setLabel("Predicted DO");
      setAvgValue(location.state.avgDo.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffDoSinceStart.toFixed(2)
      );
    } else if (e.target.value == "ph") {
      setforecastData(location.state.phForecast);
      setHeader("Forecast for PH");
      setHeader2("Statistics for PH");
      setLabel("Predicted PH");
      setAvgValue(location.state.avgPh.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffPhSinceStart.toFixed(2)
      );
    } else if (e.target.value == "wco") {
      setforecastData(location.state.wcoForecast);
      setHeader("Forecast for Coliform");
      setHeader2("Statistics for Coliform");
      setLabel("Predicted CO");
      setAvgValue(location.state.avgCo.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffCoSinceStart.toFixed(2)
      );
    } else if (e.target.value == "wec") {
      setforecastData(location.state.wecForecast);
      setHeader("Forecast for Electric Conductivity");
      setHeader2("Statistics for Electric Conductivity");
      setLabel("Predicted EC");
      setAvgValue(location.state.avgEc.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffEcSinceStart.toFixed(2)
      );
    } else if (e.target.value == "wna") {
      setforecastData(location.state.wnaForecast);
      setHeader("Forecast for Nitrate");
      setHeader2("Statistics for Nitrate");
      setLabel("Predicted Nitrate");
      setAvgValue(location.state.avgNa.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffNaSinceStart.toFixed(2)
      );
    } else {
      setforecastData(location.state.bdoForecast);
      setHeader("Forecast for Biochemical Demand Oxygen");
      setHeader2("Statistics for Biochemical Demand Oxygen");
      setLabel("Predicted BDO");
      setAvgValue(location.state.avgBdo.toFixed(2));
      setpercentDiffSinceStart(
        location.state.percentDiffBdoSinceStart.toFixed(2)
      );
    }
  };

  return (
    <div>
      <Navbar variant="dark" style={{ backgroundColor: "#003B46" }}>
        <div style={{ marginLeft: "5%" }}>
          <Navbar.Brand href="/dashboard" className="Nav-header">
            <h1>Aqua365</h1>
          </Navbar.Brand>
          <Nav className="mr-auto"></Nav>
        </div>
        <Nav className="ml-auto">
          <Nav.Link
            onClick={() => {
              history.push({
                pathname: "/viewdata",
              });
            }}
          >
            View data
          </Nav.Link>
          <Nav.Link
            onClick={() => {
              history.push({
                pathname: "/insights",
                state: {
                  avgBdo: avgBdo,
                  avgCo: avgCo,
                  avgDo: avgDo,
                  avgEc: avgEc,
                  avgNa: avgNa,
                  avgPh: avgPh,
                  avgWQI: avgWqi,
                  bdoForecast: bdoForecast,
                  doForecast: doForecast,
                  phForecast: phForecast,
                  wcoForecast: wcoForecast,
                  wecForecast: wecForecast,
                  wnaForecast: wnaForecast,
                  percentDiffBdoSinceStart: percentDiffBdoSinceStart,
                  percentDiffCoSinceStart: percentDiffCoSinceStart,
                  percentDiffDoSinceStart: percentDiffCoSinceStart,
                  percentDiffEcSinceStart: percentDiffEcSinceStart,
                  percentDiffNaSinceStart: percentDiffNaSinceStart,
                  percentDiffPhSinceStart: percentDiffPhSinceStart,
                  percentDiffWqiLastStart: percentDiffWqiSinceStart,
                  percentDiffWqiSinceStart: percentDiffWqiSinceStart,
                },
              });
            }}
          >
           Insights
          </Nav.Link>
          <Nav.Link>
            <Link to="/">Logout</Link>
          </Nav.Link>
        </Nav>
      </Navbar>

      <div class="container">
        <br />
        <InputLabel id="label">Attribute</InputLabel>
        <Select labelId="label" id="select" onChange={dropDownChangeHandler}>
          <MenuItem value="bdo">Biochemical Demand of Oxygen</MenuItem>
          <MenuItem value="do">Dissolved Oxygen</MenuItem>
          <MenuItem value="ph">PH</MenuItem>
          <MenuItem value="wco">Coliform</MenuItem>
          <MenuItem value="wec">Electric Conductivity</MenuItem>
          <MenuItem value="wna">Nitrate</MenuItem>
        </Select>

        {/* <Dropdown options={options} onChange={dropDownChangeHandler} value={defaultOption} placeholder="Select an option" />; */}
        <br />
        <br />
        <h1 className="font-applier-header">{header}</h1>
        <hr />
        <div className="chart">
          <Line data={data1} options={options} height={400} width={600} />
        </div>
        <br />
        <br />

        {/* <div class="card">
            <img src="img_avatar.png" alt="Avatar" style={{width:"100%"}}>
            <div class="container">
                <h4><b>John Doe</b></h4>
                <p>Architect Engineer</p>
            </div>
        </div> */}

        <div className="card">
          <div className="card-container">
            <br />
            <h4>
              <strong>{header2}</strong>
            </h4>
            <hr />
            <ul className="list">
              <li>
                <strong>Average Value: </strong>
                {avgValue}
              </li>
              <li>
                <strong>Percentage Difference Since Start: </strong>
                {percentDiffSinceStart}
              </li>
            </ul>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
}

export default Insights;
