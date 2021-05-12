import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Navbar, Nav, Row, Col, Image } from 'react-bootstrap/esm';
import Button from '../../node_modules/react-bootstrap/Button';
import {Link, useHistory, useLocation} from 'react-router-dom';


function Result() {
    const location = useLocation();
    const history = useHistory();

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
    

    //WQI formula
    const[WQI, setWQI] = useState(0);
    const[flag, setFlag] = useState(false);

    //Inputs

    //States

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
                setTemperatureValidation("Temperature is greater than optimal (Optimal range: 24-27°C)");
            }else if(temperature < 24){
                setTemperatureValidation("Temperature is lower than optimal (Optimal range: 24-27°C)");
            }

            //2)dissolved Oxygen Validation
            if(dissolvedOxygen < 6){
                setDissolvedOxygenValidation("Dissolved Oxygen level is Dangerous (Optimal range: 6-9 mg/l)");
            }else if (dissolvedOxygen > 9){
                setDissolvedOxygenValidation("Dissolved Oxygen level is high (Optimal range: 6-9 mg/l)");
            }

            //3)phLevel Validation
            if(phLevel > 9){
                setPhLevelValidation("PH level is too high (Optimal range: 6.5 to 9)");
            }else if(phLevel < 6){
                setPhLevelValidation("PH level is too low (Optimal range: 6.5 to 9)");
            }

            //4)conductivity
            if(conductivity > 1000){
                setConductivityValidation("Conductivity is too high (Optimal range: 200-1000 µs/cm)");
            }else if(conductivity < 200){
                setConductivityValidation("Conductivity is too low (Optimal range: 200-1000 µs/cm)");
            }

            //5)Bod 
            if(bod > 1 && bod < 2){
                setBodValidation("Best (Optimal range: 1-6 mg/l)");
            }else if(bod > 3 && bod < 6){
                setBodValidation("Moderate (Optimal range: 1-6 mg/l)");
            }else if(bod > 7 && bod < 9){
                setBodValidation("Poor (Optimal range: 1-6 mg/l)");
            }else if(bod > 9){
                setBodValidation("Bio Chemical Oxygen Demand is very poor (Optimal range: 1-6 mg/l)");
            }

            //6)Nitrate
            if(nitrate > 80){
                setNitrateValidation("Nitrate level is too High!");
            }

            //7)coliform
            if(coliform > 3000){
                setColiformValidation("Coliform is too High! (Optimal range: 0-3000 TC/100ml)");
            }
            //8)Year
            if(year < 2020){
                setYearValidation("Year cannot be less than 2020");
            }
            
            const data = {
                stationCode: stationCode,
                temp: temperature,
                do : dissolvedOxygen,
                ph : phLevel,
                conductivity : conductivity,
                bod : bod,
                nitrate : nitrate,
                tc : coliform,
                year:year
            }

            console.log(data);
            event.preventDefault();
            axios.post('/savedetails', data)
                .then((response)=>{
                    console.log(response.status);
                    console.log(response.data);
                    setWQI(phLevel * 0.165 + dissolvedOxygen * 0.281 + bod * 0.234 + nitrate * 0.028+ coliform * 0.281);
                    setFlag(true);
                })
                .catch((error)=>{
                    console.log(error);
                })

        }
      }

      useEffect(()=>{
        console.log("123");
        console.log(location);

        setavgBdo(location.state.avgBdo);
            setavgCo(location.state.avgCo);
            setavgDo(location.state.avgDo);
            setavgEc(location.state.avgEc);
            setavgNa(location.state.avgNa);
            setavgPh(location.state.avgPh);
            setavgWQI(location.state.avgWQI);

            setbdoForecast(location.state.bdoForecast);
            setdoForecast(location.state.doForecast);
            setphForecast(location.state.phForecast);
            setwcoForecast(location.state.wcoForecast);
            setwecForecast(location.state.wecForecast);
            setwnaForecast(location.state.wnaForecast);

            setpercentDiffBdoSinceStart(location.state.percentDiffBdoSinceStart);
            setpercentDoSinceStart(location.state.percentDiffDoSinceStart);
            setpercentCoSinceStart(location.state.percentDiffCoSinceStart);
            setpercentEcSinceStart(location.state.percentDiffEcSinceStart);
            setpercentNasSinceStart(location.state.percentDiffNaSinceStart);
            setpercentPhSinceStart(location.state.percentDiffPhSinceStart);
            setpercentDiffWqiLastStart(location.state.percentDiffWqiLastStart);
            setpercentDiffWqiSinceStart(location.state.percentDiffWqiSinceStart);

      },[]);
    return (
        <div>
        <Navbar variant="dark" style={{backgroundColor: "#003B46"}}>
                    <div style={{marginLeft:"5%"}}>
                        <Navbar.Brand href="/dashboard"className="Nav-header"><h1>Aqua365</h1></Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </div>
                    <Nav className="ml-auto">
                        <Nav.Link className = "font-applier-content" onClick={()=>{
                            history.push({
                                pathname:'/viewdata'
                            })
                        }}>View data</Nav.Link>
                        <Nav.Link className = "font-applier-content" onClick={()=>{
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
                        <Nav.Link className = "font-applier-content" onClick={()=>{
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
                        <Nav.Link className = "font-applier-content"><Link to="/">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
        <br/>
        <br/>
        <div className="forms container">
        <h2 className="form-heading font-applier-header">Make an Entry</h2>
        <hr/>
        <br/>
        <div className={classes.root}>
        <div>
          <TextField
            type="number"
            id="standard-full-width"
            label="Station Code"
            style={{ margin: 8 }}
            placeholder="Enter Station Code"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event)=>{
                setStationCode(event.target.value);
            }}
            variant="outlined"
          />
            <br />
          <TextField
            label="Temperature (°C)"
            id="margin-none"
            placeholder="Enter Temperature"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                    setTemperature(event.target.value)
            }}
            helperText={temperatureValidation}
          />
          <TextField
            label="Dissolved Oxygen (mg/l)"
            id="margin-dense"
            placeholder="Enter Dissolved Oxxygen"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setDissolvedOxygen(event.target.value)
            }}
            helperText={dissolvedOxygenValidation}
            />
          <TextField
            label="PH level"
            id="margin-normal"
            placeholder="Enter PH level"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setPhLevel(event.target.value)
            }} 
            helperText={phLevelValidation}
          />

          <br/>
        </div>
        <div>
        <br />
            <TextField
            label="Conductivity (µs/cm)"
            id="margin-normal"
            placeholder="Enter Conductivity"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setConductivity(event.target.value)
            }}
            helperText={conductivityValidation}
            />

            <TextField
            label="Biochemical Oxygen Demand"
            id="margin-normal"
            placeholder="Enter B.O.D (mg/l)"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setBod(event.target.value)
            }}
            helperText={bodValidation}
            />
          <TextField
            label="Nitrate (mg/l)"
            id="outlined-margin-dense"
            placeholder="Enter Nitrate Value"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setNitrate(event.target.value)
            }}
            helperText={nitrateValidation}
          />
          <br />
          

          <div className="last">
            <TextField
            label="Total Coliform (TC/100ml)"
            id="outlined-margin-normal"
            className={classes.textField}
            placeholder="Enter Coliform Value"
            margin="normal"
            variant="outlined"
            onChange={(event)=>{
            setColiform(event.target.value)
            }}
            helperText={coliformValidation}
             /> 
             
             <TextField
             label="Year"
             id="outlined-margin-normal"
             placeholder="Enter Year"
             className={classes.textField}
             margin="normal"
             variant="outlined"
             onChange={(event)=>{
             setYear(event.target.value)
             }}
             helperText={yearValidation}
              />                    
        </div>
        
        </div>
      </div>
      <br/>
      <Button 
      variant="contained" 
      color="primary"
      style={{backgroundColor: "#003B46", color:"white"}}
      onClick={(event)=>{
            sumbitDetails(event);
      }}
      >
            Submit
    </Button>
    <br/>
    <br/>
    {flag? <h1>WQI: {WQI.toFixed(2)}</h1>:null}
    {flag? 
    <div className="card">
            <div className="card-container">
                <br/>
                <h4><strong>Analysis</strong></h4>
                <hr/>
                <ul>
                    <strong>{temperatureValidation}</strong><br/>
                    <strong>{dissolvedOxygenValidation}</strong><br/>
                    <strong>{phLevelValidation}</strong><br/>
                    <strong>{conductivityValidation}</strong><br/>
                    <strong>{bodValidation}</strong><br/>
                    <strong>{nitrateValidation}</strong><br/>
                    <strong>{coliformValidation}</strong>
                    <strong>{yearValidation}</strong>
                    <br/>
                    <Button style={{backgroundColor: "#003B46"}}
                    onClick={()=>{
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
                            
                        })
                    }}>
                        Insights
                    </Button>
                </ul>
               
            </div>
        </div> : null }
    
    {/* <Row>
      <Col class="Warnings">
        <br />
        {temperatureValidation}
        <br />
        {dissolvedOxygenValidation}
        <br/>
        {phLevelValidation}
        <br/>
        {conductivityValidation}
        <br/>
        {bodValidation}
        <br/>
        {nitrateValidation}
        <br/>
        {coliformValidation}
        {yearValidation}
        <br/>
      </Col>
      <Col></Col>
      <Col></Col>
    </Row> */}
    <br />
    {allValidation}
   
    </div>
        </div>
    )
}

export default Result
