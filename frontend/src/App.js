import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './estructura/login/Login';
import Catalogo from './estructura/catalogo/Catalogo';
import Registro from './estructura/registro/Registro';
import Recuperar from './estructura/recuperar/Recuperar';
import Restablecer from './estructura/reset_password/reset_password';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/restablecer" element={<Restablecer />} />
      </Routes>
    </Router>
  );
}

export default App;