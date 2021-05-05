import React from 'react';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Row, Col, Image } from 'react-bootstrap/esm';
import { Bar, Line, Pie } from 'react-chartjs-2';

function LandingPage() {
    const [string, setstring] = useState("");

    useEffect(() => {
        fetch('/testapi').then(response => {
            if (response.ok) {
                console.log(response)
                return response.json()
            }
        }).then(data => {
            console.log(data);
            setstring(data.name);
        })

    }, [])

    const data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19.5, 3.5, 5, 2, 3],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: '# of predicted',
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                backgroundColor: '#742774',
                borderColor: '#742774',
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
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Aqua365</Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
            </Navbar>
            <div class="container">
                <h1>{string}</h1>
                <div className="chart">
                    <Line data={data} options={options} height={400} width={600} />
                </div>
            </div>
        </div>
    )
}

export default LandingPage
