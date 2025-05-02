import React from 'react';
import './indexcss.css';  // Asegúrate de que tu archivo CSS esté en la carpeta src

const FerremasPage = () => {
  return (
    <div className="box-gen">
      <header>
        <div className="container box-mid">
          {/* Columna 1 */}
          <div className="col-md-4">
            <div className="box text-center">
              <h2>Ferreteria y constructora</h2>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="col-md-4">
            <div className="box text-center box-titulo">
              <h1 className="titulo">Ferremas</h1>
            </div>
          </div>
          {/* Columna 3 */}
          <div className="col-md-4">
            <div className="box text-center">
              <h3>zapayo</h3>
            </div>
          </div>
        </div>
      </header>

      <div className="container box-top">
        <div className="row">
          {/* Columna 1 */}
          <div className="col-md-4">
            <div className="box text-center"></div>
          </div>
          {/* Columna 2 */}
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
                <button type="button" className="btn btn-primary">Enviar</button>
              </div>
            </div>
          </div>
          {/* Columna 3 */}
          <div className="col-md-4">
            <div className="box text-center"></div>
          </div>
        </div>
      </div>

      <footer>
        <div className="box-bottom"></div>
      </footer>
    </div>
  );
};

export default FerremasPage;