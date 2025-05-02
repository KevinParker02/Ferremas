import React from 'react';
import { Helmet } from 'react-helmet'; 
import FerremasPage from './components/FerremasPage';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
    <Helmet>
    </Helmet>
    <FerremasPage />
    </div>
  );
}

export default App;