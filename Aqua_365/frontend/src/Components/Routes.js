import React, { Component } from 'react'
import { Route } from "react-router-dom"

import test from './test';

class Routes extends Component {
    render () {
        return (
            <div>
                <Route path="/" component={ test } />
            </div>
        )
    }
}

export default Routes;