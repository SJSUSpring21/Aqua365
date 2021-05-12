import React, { Component } from 'react'
import { Route } from "react-router-dom"
import LandingPage from './LandingPage';
import HeroSection from './HeroSection';
import ViewData from './ViewData';

import Result from './Result';
import LoginPage from './LoginPage';
import Insights from './Insights';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route exact path='/dashboard' component= {LandingPage} />
                <Route exact path='/' component = {HeroSection} />
                <Route exact path="/result" component = {Result} />
                <Route exact path='/login' component = {LoginPage} />
                <Route exact path='/viewdata' component = {ViewData} />
                <Route exact path='/insights' component = {Insights} />
            </div>
        )
    }
}

export default Routes;