import React, { Component } from 'react'
import { Route } from "react-router-dom"
import LandingPage from './LandingPage';
import hero from './HeroSection';
import test from './test';
import Result from './Result';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route exact path='/dashboard' component= {LandingPage} />
                <Route exact path='/' component= {hero} />
                <Route exact path = '/result' component ={Result} />
            </div>
        )
    }
}

export default Routes;