import React, { Component } from 'react'
import { Route } from "react-router-dom"
import LandingPage from './LandingPage';

import test from './test';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route path='/' component= {LandingPage} />
            </div>
        )
    }
}

export default Routes;