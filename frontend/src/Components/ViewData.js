import React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid";
import { Navbar, Nav, Row, Col, Image } from 'react-bootstrap/esm';
import {Link, useHistory, useLocation} from 'react-router-dom';

const rows = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "XGrid", col2: "is Awesome" },
  { id: 3, col1: "Material-UI", col2: "is Amazing" },
];

const columns = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];

export default function App() {
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
          <Nav.Link>
            <Link to="/">Logout</Link>
          </Nav.Link>
        </Nav>
      </Navbar>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}
