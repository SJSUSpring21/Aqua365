import React from 'react';
import {useState, useEffect} from 'react';
import {Navbar,Nav,Button, Row, Col, Image} from 'react-bootstrap/esm';
import {Bar, Line, Pie} from 'react-chartjs-2';

function LandingPage() {
    const [string, setstring] = useState("");

    useEffect(()=>{
        fetch('/testapi').then(response => {
            if(response.ok){
                console.log(response)
                return response.json()
            }
        }).then(data => {
            console.log(data);
            setstring(data.name);
        })
    
    },[])
    const data = {
        labels:['Jan', 'Feb', 'Mar','Apr','May'],
        dataSets:[
            {
                label:"Labels",
                data:[3,1,2,3,4]
            }
        ]
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Aqua365</Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
            </Navbar>
            <h1>{string}</h1>
            <div className="chart">
                <Line
                    data={data}
                />
            
            </div>
        </div>
    )
}

export default LandingPage
