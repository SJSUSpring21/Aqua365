import React from 'react';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Row, Col, Image } from 'react-bootstrap/esm';
import {Line} from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import {Button} from 'react-bootstrap'
import axios from 'axios';
import {Link, useHistory, useLocation} from 'react-router-dom';
import './Insights.css';

function LandingPage() {
    const history = useHistory();
    const [string, setstring] = useState("");
    const [yearList, setyearList] = useState([]);
    const [actualWqi, setactualWqi] = useState([]);
    const [predictedWqi, setpredictedWqi] = useState([]);
    const [graph2_arima_forecast, setGraph2] = useState([]);

    //Form Fields

    const[stationCode, setStationCode]=useState(0);
    const[temperature, setTemperature]= useState(0);
    const[dissolvedOxygen, setDissolvedOxygen]= useState(0);
    const[phLevel, setPhLevel]= useState(0);
    const[conductivity, setConductivity]= useState(0);
    const[bod, setBod]= useState(0);
    const[nitrate, setNitrate]= useState(0);
    const[coliform, setColiform]= useState(0);
    const[year,setYear] = useState(0);

    // Validation text
    const[allValidation, setAllValidation] = useState("");
    const[temperatureValidation, setTemperatureValidation]= useState("");
    const[dissolvedOxygenValidation, setDissolvedOxygenValidation]= useState("");
    const[phLevelValidation, setPhLevelValidation]= useState("");
    const[conductivityValidation, setConductivityValidation]= useState("");
    const[bodValidation, setBodValidation]= useState("");
    const[nitrateValidation, setNitrateValidation]= useState("");
    const[coliformValidation, setColiformValidation]= useState("");
    const[yearValidation, setYearValidation]= useState("");

    //
    const[avgBdo, setavgBdo] = useState(0)
    const[avgCo,setavgCo] = useState(0)
    const[avgDo,setavgDo] = useState(0)
    const[avgEc, setavgEc] = useState(0)
    const[avgNa, setavgNa] = useState(0)
    const[avgPh,setavgPh] = useState(0)
    const[avgWQI, setavgWQI] = useState(0)

    const[bdoForecast, setbdoForecast] = useState([]);
    const[doForecast, setdoForecast] = useState([]);
    const[phForecast, setphForecast] = useState([]);
    const[wcoForecast, setwcoForecast] = useState([]);
    const[wecForecast, setwecForecast] = useState([]);
    const[wnaForecast, setwnaForecast] = useState([]);

    const [percentDiffBdoSinceStart, setpercentDiffBdoSinceStart] = useState(0);
    const [percentDiffCoSinceStart, setpercentCoSinceStart] = useState(0);
    const [percentDiffDoSinceStart, setpercentDoSinceStart] = useState(0);
    const [percentDiffEcSinceStart, setpercentEcSinceStart] = useState(0);
    const [percentDiffNaSinceStart, setpercentNasSinceStart] = useState(0);
    const [percentDiffPhSinceStart, setpercentPhSinceStart] = useState(0);
    const [percentDiffWqiLastStart, setpercentDiffWqiLastStart] = useState(0);
    const [percentDiffWqiSinceStart, setpercentDiffWqiSinceStart] = useState(0);




    //
    //Inputs

    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
        },
        textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          width: '25ch',
        },
      }));

      const classes = useStyles();

      const sumbitDetails = (event) =>{

        console.log(stationCode, temperature, dissolvedOxygen, phLevel, conductivity, bod, nitrate, coliform);
        // Validations (at the end)
        //1)Temperature Validation
        if(stationCode == 0 || temperature == 0 || dissolvedOxygen ==0 || phLevel == 0 || conductivity ==0 || bod == 0 || nitrate == 0 || coliform == 0){
            setAllValidation("No fields can be set empty");
        
        }else{
            
            //1)temperature validation
            if(temperature > 27){
                setTemperatureValidation("Temperature is greater than optimal");
            }else if(temperature < 24){
                setTemperatureValidation("Temperature is lower than optimal");
            }

            //2)dissolved Oxygen Validation
            if(dissolvedOxygen < 6.5){
                setDissolvedOxygenValidation("Dissolved Oxygen level is Dangerous");
            }else if (dissolvedOxygen > 9){
                setDissolvedOxygenValidation("Dissolved Oxygen level is high");
            }

            //3)phLevel Validation
            if(phLevel > 9){
                setPhLevelValidation("PH level is too high");
            }else if(phLevel < 6){
                setPhLevelValidation("PH level is too low");
            }

            //4)conductivity
            if(conductivity > 1000){
                setConductivityValidation("Conductivity is too high");
            }else if(conductivity < 200){
                setConductivityValidation("Conductivity is too low");
            }

            //5)Bod 
            if(bod > 1 && bod < 2){
                setBodValidation("Best");
            }else if(bod > 3 && bod < 6){
                setBodValidation("Moderate");
            }else if(bod > 7 && bod < 9){
                setBodValidation("Poor");
            }else if(bod > 9){
                setBodValidation("Very Poor");
            }

            //6)Nitrate
            if(nitrate > 80){
                setNitrateValidation("Nitrate level is too High!");
            }

            //7)coliform
            if(coliform > 3000){
                setColiformValidation("Coliform is too HIGH!");
            }
            //8)Year
            if(year < 2020){
                setYearValidation("Year cannot be less than 2020");
            }
            
            const data = {
                stationCode: stationCode,
                temperature: temperature,
                dissolvedOxygen : dissolvedOxygen,
                phLevel : phLevel,
                conductivity : conductivity,
                bod : bod,
                nitrate : nitrate,
                coliform : coliform
            }

            console.log(data);
            event.preventDefault();
            axios.post('/savedetails', data)
                .then((response)=>{
                    console.log(response.status);
                    console.log(response.data);
                })
                .catch((error)=>{
                    console.log(error);
                })

        }
      }


    useEffect(() => {
        fetch('/testapi').then(response => {
            if (response.ok) {
                console.log(response)
                return response.json()
            }
        }).then(data => {
            console.log(data);
            setstring(data.name);
            setyearList(data.yearList);
            setactualWqi(data.actualWqi);
            setpredictedWqi(data.predictedWqi);
        })

        fetch('/graphsAndAverages').then(response => {
            if (response.ok) {
                console.log(response)
                return response.json()
            }
        }).then(data => {
            console.log(data);
            setGraph2(data.graph2_arima_forecast);
            
            setavgBdo(data.avgBdo);
            setavgCo(data.avgCo);
            setavgDo(data.avgDo);
            setavgEc(data.avgEc);
            setavgNa(data.avgNa);
            setavgPh(data.avgPh);
            setavgWQI(data.avgWQI);

            setbdoForecast(data.bdoForecast);
            setdoForecast(data.doForecast);
            setphForecast(data.phForecast);
            setwcoForecast(data.wcoForecast);
            setwecForecast(data.wecForecast);
            setwnaForecast(data.wnaForecast);

            setpercentDiffBdoSinceStart(data.percentDiffBdoSinceStart);
            setpercentDoSinceStart(data.percentDiffDoSinceStart);
            setpercentCoSinceStart(data.percentDiffCoSinceStart);
            setpercentEcSinceStart(data.percentDiffEcSinceStart);
            setpercentNasSinceStart(data.percentDiffNaSinceStart);
            setpercentPhSinceStart(data.percentDiffPhSinceStart);
            setpercentDiffWqiLastStart(data.percentDiffWqiLastStart);
            setpercentDiffWqiSinceStart(data.percentDiffWqiSinceStart);


        })

    }, [])

    const data = {
        // labels: ['1', '2', '3', '4', '5', '6'],
        labels: yearList,
        datasets: [
            {
                label: 'Actual WQI',
                // data: [12, 19.5, 3.5, 5, 2, 3],
                data: actualWqi,
                fill: false,
                backgroundColor: '#66A5AD',
                borderColor: '#66A5AD',
            },
            {
                label: 'Predicted WQI',
                // data: [33, 25, 35, 51, 54, 76],
                data: predictedWqi,
                fill: false,
                backgroundColor: '#003B46',
                borderColor: '#003B46',
            },
        ],
    };

    const data1 = {
        // labels: ['1', '2', '3', '4', '5', '6'],
        labels: ['2021','2022','2023','2024','2025'],
        datasets: [
            {
                label: 'Predicted WQI',
                // data: [33, 25, 35, 51, 54, 76],
                data: graph2_arima_forecast,
                fill: false,
                backgroundColor: '#003B46',
                borderColor: '#003B46',
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

    

    return (
        <div>
            <div className="graph1">
                <Navbar variant="dark" style={{backgroundColor: "#003B46"}}>
                    <div style={{marginLeft:"5%"}}>
                        <Navbar.Brand href="/dashboard"className="Nav-header"><h1>Aqua365</h1></Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </div>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={()=>{
                            history.push({
                                pathname:'/viewdata'
                            })
                        }}>View data</Nav.Link>
                        <Nav.Link onClick={()=>{
                            history.push({
                                pathname:'/result',
                                state:{
                                    avgBdo :avgBdo,
                                    avgCo : avgCo,
                                    avgDo : avgDo,
                                    avgEc : avgEc,
                                    avgNa: avgNa,
                                    avgPh : avgPh,
                                    avgWQI : avgWQI,
                                    bdoForecast: bdoForecast,
                                    doForecast : doForecast,
                                    phForecast: phForecast,
                                    wcoForecast : wcoForecast,
                                    wecForecast:wecForecast,
                                    wnaForecast : wnaForecast,
                                    percentDiffBdoSinceStart : percentDiffBdoSinceStart,
                                    percentDiffCoSinceStart : percentDiffCoSinceStart,
                                    percentDiffDoSinceStart : percentDiffCoSinceStart,
                                    percentDiffEcSinceStart : percentDiffEcSinceStart,
                                    percentDiffNaSinceStart : percentDiffNaSinceStart,
                                    percentDiffPhSinceStart : percentDiffPhSinceStart,
                                    percentDiffWqiLastStart :  percentDiffWqiLastStart,
                                    percentDiffWqiSinceStart : percentDiffWqiSinceStart
                                }
                            });
                        }}
                        >Make an entry</Nav.Link>
                        <Nav.Link onClick={()=>{
                            history.push({
                                pathname:'/insights',
                                state:{
                                    avgBdo :avgBdo,
                                    avgCo : avgCo,
                                    avgDo : avgDo,
                                    avgEc : avgEc,
                                    avgNa: avgNa,
                                    avgPh : avgPh,
                                    avgWQI : avgWQI,
                                    bdoForecast: bdoForecast,
                                    doForecast : doForecast,
                                    phForecast: phForecast,
                                    wcoForecast : wcoForecast,
                                    wecForecast:wecForecast,
                                    wnaForecast : wnaForecast,
                                    percentDiffBdoSinceStart : percentDiffBdoSinceStart,
                                    percentDiffCoSinceStart : percentDiffCoSinceStart,
                                    percentDiffDoSinceStart : percentDiffCoSinceStart,
                                    percentDiffEcSinceStart : percentDiffEcSinceStart,
                                    percentDiffNaSinceStart : percentDiffNaSinceStart,
                                    percentDiffPhSinceStart : percentDiffPhSinceStart,
                                    percentDiffWqiLastStart :  percentDiffWqiLastStart,
                                    percentDiffWqiSinceStart : percentDiffWqiSinceStart
                                }
                            });
                        }}>Insights</Nav.Link>
                        <Nav.Link><Link to="/">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                    <Row class="container">
                    <Col></Col>
                    <Col><h1 className="font-applier-header">Water Quality Index Analysis</h1></Col>
                    <Col>
                        


                    </Col>
                    </Row>
                    <div class="container">
                        <br/>
                        <hr/>
                        <div className="chart">
                            <Line data={data} options={options} height={400} width={600} />
                        </div>
                    </div>
            </div>

            <div className="card">
            <div className="card-container">
                <br/>
                <h4><strong>Insights for Water Quality Index</strong></h4>
                <hr/>
                <ul>
                    <li><strong>Average Value: </strong>{avgWQI.toFixed(2)}</li>
                    <li><strong>Percentage Difference Since Start: </strong>{percentDiffWqiSinceStart.toFixed(2)}</li>
                </ul>
            </div>
        </div>
        <br/>
        <br/>

            <div className="graph2">
                <div class="container">
                    <br/>
                    <h1 className="font-applier-header">Forecast Data from ARIMA Model</h1>
                    <hr/>
                    <div className="chart">
                        <Line data={data1} options={options} height={400} width={600} />
                    </div>
                    <br/>
                    <br/>
                </div>
            </div>


           
            
              

              
        </div>
    )
}

export default LandingPage
