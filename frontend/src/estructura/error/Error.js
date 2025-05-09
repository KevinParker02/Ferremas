import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';

const Error = () => {
  return (
    <div>
      <h1>Esta página no existe ctm</h1>
      {/* …lo que quieras mostrar… */}
    </div>
  )
}

export default Error;