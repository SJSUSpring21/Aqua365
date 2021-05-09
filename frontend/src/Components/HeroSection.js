import React from 'react'
import { Navbar, Nav, Row, Col, Image, Button } from 'react-bootstrap/esm';
import './HeroSection.css'
import { Link } from 'react-router-dom';
// import '../App.css'


function HeroSection({
    lightBg, topline, lightText, lightTextDesc, headline, decription, buttonLabel, img, alt, imgStart
}) {
    return (
        <div>
            <Navbar variant="dark" style={{backgroundColor: "#003B46"}}>
                    <div style={{marginLeft:"5%"}}>
                        <Navbar.Brand href="/"className="Nav-header"><h1>Aqua365</h1></Navbar.Brand>
                        <Nav className="mr-auto">
                        </Nav>
                    </div>
                </Navbar>
            <div className='hero-container'>
                <video src='/videos/video1.mp4' autoPlay loop muted></video>
                <h1 className="hero-header">Aqua 365</h1>
                <div className="hero-btns">
                    <Button variant="primary btn-lg" link='/login' style={{backgroundColor: "#003B46", height: "105%"}}><span className="font-applier-button" style={{paddingLeft:"10px", paddingRight:"10px", paddingTop:"10px", paddingBottom:"10px"}}>Login</span></Button>{' '}
                </div>
            </div>
        </div>
    )
}

export default HeroSection