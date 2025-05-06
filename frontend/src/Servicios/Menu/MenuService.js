
const MenuService = {
    obtenerMenuPorRol: (rolId) => {
      switch (rolId) {
        case 1: // Administrador
          return [
            { nombre: 'Dashboard', ruta: '/admin' },
            { nombre: 'Usuarios', ruta: '/usuarios' },
            { nombre: 'Productos', ruta: '/productos' },
            { nombre: 'Reportes', ruta: '/reportes' },
          ];
        case 2: // Vendedor
          return [
            { nombre: 'Ventas', ruta: '/ventas' },
            { nombre: 'Catálogo', ruta: '/catalogo' },
            { nombre: 'Clientes', ruta: '/clientes' },
          ];
        case 3: // Bodeguero
          return [
            { nombre: 'Inventario', ruta: '/inventario' },
            { nombre: 'Movimientos', ruta: '/movimientos' },
          ];
        case 4: // Contador
          return [
            { nombre: 'Pagos', ruta: '/pagos' },
            { nombre: 'Facturas', ruta: '/facturas' },
            { nombre: 'Reportes contables', ruta: '/reportes-contables' },
          ];
        case 5: // Cliente
          return [
            { nombre: 'Catálogo', ruta: '/catalogo' },
            { nombre: 'Mis pedidos', ruta: '/pedidos' },
            { nombre: 'Perfil', ruta: '/perfil' },
          ];
        default:
          return [];
      }
    }
  };
  
  export default MenuService;
  