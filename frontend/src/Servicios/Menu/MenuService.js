import { useNavigate } from 'react-router-dom';

const MenuService = {
  
    obtenerMenuPorRol: (rolId) => {
      switch (rolId) {
        case 11: // Administrador
          return [
            { nombre: 'Dashboard', ruta: '/admin' },
            { nombre: 'Usuarios', ruta: '/usuarios' },
            { nombre: 'Productos', ruta: '/productos' },
            { nombre: 'Reportes', ruta: '/reportes' },
          ];
        case 21: // Vendedor
          return [
            { nombre: 'Ventas', ruta: '/ventas' },
            { nombre: 'Catálogo', ruta: '/catalogo' },
            { nombre: 'Clientes', ruta: '/clientes' },
          ];
        case 31: // Bodeguero
          return [
            { nombre: 'Inventario', ruta: '/inventario' },
            { nombre: 'Movimientos', ruta: '/movimientos' },
          ];
        case 41: // Contador
          return [
            { nombre: 'Pagos', ruta: '/pagos' },
            { nombre: 'Facturas', ruta: '/facturas' },
            { nombre: 'Reportes contables', ruta: '/reportes-contables' },
          ];
        case 51: // Cliente
          return [
            { nombre: 'Catálogo', ruta: '/catalogo' },
            { nombre: 'Perfil', ruta: '/MiCuenta' },
          ];
        default:
          return [];
      }
    }
  };
  
  export default MenuService;
  