import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Navbar, Nav, Row, Col, Image } from 'react-bootstrap/esm';
import Button from '../../node_modules/react-bootstrap/Button';
import {Link, useHistory, useLocation} from 'react-router-dom';

function Result() {
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
    return (
        <div>
        <Navbar variant="dark" style={{backgroundColor: "#003B46"}}>
                    <div style={{marginLeft:"5%"}}>
                        <Navbar.Brand href="#home"className="Nav-header"><h1>Aqua365</h1></Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </div>
                    <Nav className="ml-auto">
                        <Nav.Link><Link to="/">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
        <div className="forms container">
                
        <h2 className="form-heading font-applier-header">Make an Entry</h2>
        <hr/>
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
            label="Temperature"
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
            label="Dissolved Oxygen"
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
            label="Conductivity"
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
            placeholder="Enter B.O.D"
            className={classes.textField}
            variant="outlined"
            onChange={(event)=>{
                setBod(event.target.value)
            }}
            helperText={bodValidation}
            />
          <TextField
            label="Nitrate"
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
            label="Total Coliform"
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
    <Row>
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
    </Row>
    <br />
    {allValidation}
   
    </div>
        </div>
    )
}

export default Result
