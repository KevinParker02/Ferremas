import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './estructura/login/Login';
import Catalogo from './estructura/catalogo/Catalogo';
import Registro from './estructura/registro/Registro';
import Recuperar from './estructura/recuperar/Recuperar';
import Restablecer from './estructura/reset_password/reset_password';

// Nuevas vistas
import Carrito from './estructura/carrito/Carrito';
import MiCuenta from './estructura/miCuenta/MiCuenta';
import Vendedor from './estructura/vendedor/Vendedor';
import Contador from './estructura/contador/Contador';
import Administrador from './estructura/administrador/Admin';
import Bodega from './estructura/bodega/Bodega';
import Error from './estructura/error/Error';

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

        <Route path="/carrito" element={<Carrito />} />
        <Route path="/miCuenta" element={<MiCuenta />} />
        <Route path="/vendedor" element={<Vendedor />} />
        <Route path="/contador" element={<Contador />} />
        <Route path="/bodega" element={<Bodega />} />
        <Route path="/admin" element={<Administrador />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;