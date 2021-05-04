import React, { Component } from 'react'

class test extends Component {
    constructor(props){
        super(props)
        this.state = {
            myString: "Hello from test component"
        }
    }

    componentDidMount() {
        fetch('/testapi').then(response => {
            if(response.ok){
                console.log(response)
                return response.json()
            }
        }).then(data => {
            this.setState({
                myString: data.name
            })
        })
    }

    render() {
        return(
            <div>
                {this.state.myString}
            </div>
        )
    }
}

export default test;
