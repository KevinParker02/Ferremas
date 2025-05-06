const USUARIO_KEY = 'usuario';

const authguard = {
  guardarUsuario: (usuario) => {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },

  obtenerUsuario: () => {
    const usuario = localStorage.getItem(USUARIO_KEY);
    return usuario ? JSON.parse(usuario) : null;
  },

  cerrarSesion: () => {
    localStorage.removeItem(USUARIO_KEY);
  },

  estaAutenticado: () => {
    return !!localStorage.getItem(USUARIO_KEY);
  },

  obtenerRol: () => {
    const usuario = authguard.obtenerUsuario();
    return usuario?.id_rol || null;
  }
};

export default authguard;