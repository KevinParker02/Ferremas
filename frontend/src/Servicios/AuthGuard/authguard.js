const USUARIO_KEY = 'usuario';


const authguard = {
  guardarUsuario(usuario) {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },
  obtenerUsuario() {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  },
  cerrarSesion() {                   
    localStorage.removeItem(USUARIO_KEY);
  },
  estaAutenticado() {
    return !!localStorage.getItem(USUARIO_KEY);
  },
  obtenerRol() {
    const u = this.obtenerUsuario();
    return u?.rol?.id ?? null;
  },
  tieneRol(rolesPermitidos = []) {
    const rol = this.obtenerRol();
    return rol !== null && rolesPermitidos.includes(rol);
  }
};

export default authguard;