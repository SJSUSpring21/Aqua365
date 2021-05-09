import React, { Component } from 'react'
import { Route } from "react-router-dom"
import LandingPage from './LandingPage';
import HeroSection from './HeroSection';

import test from './test';
import Result from './Result';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route path='/dashboard' component= {LandingPage} />
                <Route path='/' component = {HeroSection} />
                <Route parh="/result" component = {Result} />
            </div>
        )
    }
}

export default Routes;