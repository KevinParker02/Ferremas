import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import { LogOut, RefreshCw, FileText } from 'react-feather';
import './contador.css';
import logoFerremas from '../../img/logo-ferremas.png';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Contador = () => {
  const navigate = useNavigate();
  const { id_sucursal } = authguard.obtenerUsuario();

  const [pedidos, setPedidos] = useState([]);
  const [filtroComprobante, setFiltroComprobante] = useState('');
  const [resumen, setResumen] = useState({ conFactura: 0, sinFactura: 0 });

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('sucursal', id_sucursal);

    fetch(`http://localhost:8000/api/pedidos/?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setPedidos(data);
        const conFactura = data.filter(p => p.comprobante === 'Factura').length;
        const sinFactura = data.length - conFactura;
        setResumen({ conFactura, sinFactura });
      })
      .catch(console.error);
  }, [id_sucursal]);

  const handleReset = () => {
    setFiltroComprobante('');
  };

  const exportarExcel = () => {
    const dataFiltrada = pedidos.filter(p =>
      filtroComprobante === '' ||
      p.comprobante?.toLowerCase() === filtroComprobante.toLowerCase()
    );

    const worksheet = XLSX.utils.json_to_sheet(dataFiltrada.map(p => ({
      'N° Pedido': p.id_pedido,
      'Cliente': p.cliente,
      'Fecha': new Date(p.fecha_pedido).toLocaleDateString(),
      'Comprobante': p.comprobante,
      'Total': p.total_pedido
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'pedidos_contador.xlsx');
  };

  return (
    <div className="vendedor-container">
      {/* Header */}
      <header className="seller-header">
        <div className="header-izquierda">
                            <img 
                              src={logoFerremas} 
                              alt="Logo Ferremas" 
                              className="header-logo"
                              />
                        </div>
        <div className="header-actions">
        <button 
          className="btn-logout"
          onClick={() => {
            authguard.cerrarSesion();
            navigate('/login');
          }}
        >
          <LogOut size={18} className="me-2" />
          Cerrar sesión
        </button>
        </div>
      </header>

      <div className='vendedor-header'>
        <h1 className="vendedor-title">Vista del Contador</h1>
      </div>

      {/* Dashboard Resumen */}
      <div className="dashboard-resumen">
        <div className="card-resumen factura">
          <h3>Con Factura</h3>
          <p>{resumen.conFactura}</p>
        </div>
        <div className="card-resumen boleta">
          <h3>Sin Factura</h3>
          <p>{resumen.sinFactura}</p>
        </div>
      </div>


      {/* Filtros */}
      <div className="filters-container">
        <select
          value={filtroComprobante}
          onChange={e => setFiltroComprobante(e.target.value)}
        >
          <option value="">Todos los comprobantes</option>
          <option value="Boleta">Boleta</option>
          <option value="Factura">Factura</option>
        </select>

        <button className="btn btn-reset" onClick={handleReset}>
          <RefreshCw size={16} className="me-2" />
          Limpiar filtros
        </button>

        <button className="btn btn-reset" onClick={exportarExcel}>
          <FileText size={16} className="me-2" />
          Exportar Excel
        </button>
      </div>

      {/* Tabla de pedidos */}
      <div className="pedidos-table-container">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th># Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Comprobante</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos
              .filter(p =>
                filtroComprobante === '' ||
                p.comprobante?.toLowerCase() === filtroComprobante.toLowerCase()
              )
              .map(p => (
                <tr key={p.id_pedido}>
                  <td>{p.id_pedido}</td>
                  <td>{p.cliente}</td>
                  <td>{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                  <td>{p.comprobante}</td>
                  <td>${p.total_pedido.toLocaleString('es-CL')}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contador;
