import React from 'react';
import './logincs.css';
import { useNavigate } from 'react-router-dom'; 
const Login = () => {
    const navigate = useNavigate();
  return (
    <div className="box-gen">
      <header>
        <div className="container box-mid">
          <div className="col-md-4">
            <div className="box text-center">
              <h2>Ferretería y constructora</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="box text-center box-titulo">
              <h1 className="titulo">Ferremas</h1>
            </div>
          </div>
          <div className="col-md-4">
            <div className="box text-center">
              <h3>zapayo</h3>
            </div>
          </div>
        </div>
      </header>

      <div className="container box-top">
        <div className="row">
          <div className="col-md-4"></div>

          <div className="col-md-4">
            <div className="box text-center box-titulo">
              <div>
                <p>Usuario</p>
                <input type="text" className="form-control" placeholder="Escribe algo" />
              </div>
              <div>
                <p>Contraseña</p>
                <input type="password" className="form-control" placeholder="Escribe algo" />
              </div>
              <div>
                <button type="button" className="btn btn-primary"  onClick={() => navigate('/catalogo')}>Enviar</button>
              </div>
            </div>
          </div>

          <div className="col-md-4"></div>
        </div>
      </div>

      <footer>
        <div className="box-bottom"></div>
      </footer>
    </div>
  );
};

export default Login;
