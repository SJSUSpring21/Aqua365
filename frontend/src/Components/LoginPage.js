import React from 'react'
import { Form, Button, Navbar, Nav, Row, Col, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function LoginPage() {
    const history = useHistory();
    const [email, handleEmailChange] = useState("");
    const [password, handlePasswordChange] = useState("");
    const [wrongPassword, changeWrongPassword] = useState(false);

    function loginUser(event) {
        const data = {
            email: email,
            password: password
        }
        console.log(data);
        event.preventDefault();
        axios.post('/login', data)
            .then((response) => {
                if(response.data.status == 200){
                    console.log(response.data);
                    history.push('/dashboard');
                }
                if(response.data.status == 400){
                    console.log(response.data);
                    changeWrongPassword(true);
                }


            })
            .catch(error => {
                console.log(error);
                changeWrongPassword(true);
            })
    }

    let displayWrongPassword = null;
    if (wrongPassword) {
        displayWrongPassword = <span class="badge badge-pill badge-danger">Wrong Email or Password</span>
    }

    return (
        <div class='main-section'>
            <Navbar variant="dark" style={{backgroundColor: "#003B46"}}>
                <Navbar.Brand className="Nav-header" href="/">
                    <h1>Aqua 365</h1>
                </Navbar.Brand>
            </Navbar>

            <div id="content-wrap" class="container-fluid">
                <Row>
                <Col style={{marginTop:"10%"}}><h1 className="font-applier-header">Login</h1></Col>
                </Row>
                <hr style={{width:"50%"}} />
                <div class="row m-5 justify-content-center">
                    <div class="col-5">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                {/* <Form.Label>Email address</Form.Label> */}
                                <Form.Control type="email"
                                    placeholder="Enter email"
                                    onChange={(event) => {
                                        handleEmailChange(event.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control type="password"
                                    placeholder="Password"
                                    onChange={(event) => {
                                        handlePasswordChange(event.target.value)
                                    }}
                                />
                            </Form.Group>

                            <Button variant="success btn-block"
                                style={{backgroundColor: "#003B46", width:"30%"}}
                                className="loginButtonCenter"
                                type="submit"
                                onClick={(event) => {
                                    loginUser(event)
                                }}>
                                Login
                                </Button>
                        </Form>
                        <div class='row mt-3 ml-1'>
                            {displayWrongPassword}
                        </div>
                    </div>
                </div>


            </div>

            <footer id="footer" class='py-3 bg-dark text-white text-center' >
                <div id="footer-content">
                    Group 4 - Aqua 365
                </div>
            </footer>


        </div>
    )
}

export default LoginPage
