import Routes from './Components/Routes';
import { BrowserRouter } from 'react-router-dom'
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App () {
  return (
    <div className="App">
      <div id="no-popup">
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </div>
      <div id="modal">
      </div>
    </div>
  );
}

export default App;
