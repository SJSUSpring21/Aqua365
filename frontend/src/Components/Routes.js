import React, { Component } from 'react'
import { Route } from "react-router-dom"
import LandingPage from './LandingPage';
import HeroSection from './HeroSection';

import test from './test';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route path='/dashboard' component= {LandingPage} />
                <Route path='/' component = {HeroSection} />
            </div>
        )
    }
}

export default Routes;