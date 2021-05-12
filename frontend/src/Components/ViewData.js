import React, { useState, useEffect }  from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid";
import { Navbar, Nav, Row, Col, Image } from 'react-bootstrap/esm';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";

function ViewData() {

  // const rows = [
  //   { id: 1, col1: "Hello", col2: "World" },
  //   { id: 2, col1: "XGrid", col2: "is Awesome" },
  //   { id: 3, col1: "Material-UI", col2: "is Amazing" },
  // ];
  
  // const columns = [
  //   { field: "col1", headerName: "Column 1", width: 150 },
  //   { field: "col2", headerName: "Column 2", width: 150 },
  // ];

  let [columns, setColumns] = useState([]);
  let [rows, setRows] = useState([]);

  const useStyles = makeStyles({

    dataGrid: {
       width: "640px"
     }
   });

  useEffect(() => {
    fetch('/viewdata').then(response => {
        if (response.ok) {
            console.log(response)
            return response.json()
        }
    }).then(data => {
        console.log(data.dataColumns);
        // setColumns = JSON.parse(data.dataColumns)
        // setRows = JSON.parse(data.dataRows)

        let jsonCols = JSON.parse(data.dataColumns)
        let jsonObj = {}
        let jsonColList = []
        for(let i=1; i<=jsonCols.length; i++){
          jsonObj = {}
          console.log(i)

          jsonObj = jsonCols[i-1]
          // jsonObj.id = i
          delete jsonObj["_id"];
          jsonColList.push(jsonObj)
        }
        console.log(jsonColList)
        setColumns(jsonColList)
        // console.log(columns)

        let jsonRows = JSON.parse(data.dataRows)
        jsonObj = {}
        let jsonRowList = []
        for(let i=1; i<=jsonRows.length; i++){
          jsonObj = {}
          console.log(i)

          jsonObj = jsonRows[i-1]
          jsonObj.id = i
          jsonObj.width = 150
          delete jsonObj["_id"];
          jsonRowList.push(jsonObj)
        }
        console.log(jsonRowList)
        setRows(jsonRowList)
    })
  },[])
  const classes = useStyles();
  return (
    <div>
      <Navbar variant="dark" style={{ backgroundColor: "#003B46" }}>
        <div style={{ marginLeft: "5%" }}>
          <Navbar.Brand href="/dashboard" className="Nav-header">
            <h1>Aqua365</h1>
          </Navbar.Brand>
          <Nav className="mr-auto"></Nav>
        </div>
        <Nav className="ml-auto">
          <Nav.Link className = "font-applier-content">
            <Link to="/dashboard">Home</Link>
          </Nav.Link> 
          <Nav.Link className = "font-applier-content">
            <Link to="/">Logout</Link>
          </Nav.Link>
        </Nav>
      </Navbar>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
        rows={rows} 
        columns={columns} 
        autoHeight={true}
        />
      </div>
    </div>
  );
}

export default ViewData