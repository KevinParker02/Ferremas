-- -----------------------------------------------------
-- Schema Ferremas
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS Ferremas ;

-- -----------------------------------------------------
-- Schema Ferremas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS Ferremas;
USE Ferremas ;

-- Deshabilitar restricciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table ROL_USER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ROL_USER (
  id_rol INT NOT NULL unique,
  nom_rol VARCHAR(40) NOT NULL,
  PRIMARY KEY (id_rol)
  );

-- -----------------------------------------------------
-- Table REGION
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS REGION (
  id_region INT NOT NULL UNIQUE,
  nom_region VARCHAR(60) NOT NULL,
  PRIMARY KEY (id_region)
);

-- -----------------------------------------------------
-- Table COMUNA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS COMUNA (
  id_comuna INT NOT NULL UNIQUE,
  nom_comuna VARCHAR(60) NOT NULL,
  id_region INT NOT NULL,
  PRIMARY KEY (id_comuna, id_region),
  CONSTRAINT fk_COMUNA_REGION1
    FOREIGN KEY (id_region)
    REFERENCES REGION (id_region)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table USUARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS USUARIO (
  Id_user INT NOT NULL UNIQUE,
  nombre_user VARCHAR(60) NOT NULL,
  apellido_user VARCHAR(60) NOT NULL,
  rut_user INT NOT NULL UNIQUE,
  dv_user INT NOT NULL,
  celular_user INT NOT NULL,
  pass_user VARCHAR(12) NOT NULL,
  email_user VARCHAR(100) NOT NULL UNIQUE,
  direccion_user VARCHAR(100) NOT NULL,
  token VARCHAR(255) NULL,
  estado_user TINYINT NOT NULL,
  id_rol INT NOT NULL,
  id_comuna INT NOT NULL,
  PRIMARY KEY (Id_user, id_rol, id_comuna),
  CONSTRAINT fk_USUARIO_ROL_USER
    FOREIGN KEY (id_rol)
    REFERENCES ROL_USER (id_rol)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_USUARIO_COMUNA1
    FOREIGN KEY (id_comuna)
    REFERENCES COMUNA (id_comuna)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table SUCURSAL
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS SUCURSAL (
  id_sucursal INT NOT NULL UNIQUE,
  direccion_sucursal VARCHAR(100) NOT NULL,
  id_comuna INT NOT NULL,
  PRIMARY KEY (id_sucursal, id_comuna),
  CONSTRAINT fk_SUCURSAL_COMUNA1
    FOREIGN KEY (id_comuna)
    REFERENCES COMUNA (id_comuna)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table INVENTARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS INVENTARIO (
  id_inventario INT NOT NULL UNIQUE,
  stock_disponible INT NOT NULL,
  id_sucursal INT NOT NULL,
  PRIMARY KEY (id_inventario, id_sucursal),
  CONSTRAINT fk_INVENTARIO_SUCURSAL1
    FOREIGN KEY (id_sucursal)
    REFERENCES SUCURSAL (id_sucursal)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table PRODUCTO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PRODUCTO (
  id_prod INT NOT NULL UNIQUE,
  nom_prod VARCHAR(60) NOT NULL,
  marca_prod VARCHAR(20) NOT NULL,
  codigo_fabricante INT NOT NULL,
  id_inventario INT NOT NULL,
  precio_prod INT NOT NULL,
  Estado_prod TINYINT NOT NULL,
  foto_prod BLOB NULL,
  PRIMARY KEY (id_prod, id_inventario),
  CONSTRAINT fk_PRODUCTO_INVENTARIO1
    FOREIGN KEY (id_inventario)
    REFERENCES INVENTARIO (id_inventario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table TIPO_DESPACHO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TIPO_DESPACHO (
  id_despacho INT NOT NULL UNIQUE,
  nom_despacho VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_despacho)
);

-- -----------------------------------------------------
-- Table ESTADO_PEDIDO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ESTADO_PEDIDO (
  id_estado INT NOT NULL UNIQUE,
  nom_estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_estado)
);

-- -----------------------------------------------------
-- Table TIPO_COMPROBANTE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TIPO_COMPROBANTE (
  id_tipo_comprobante INT NOT NULL UNIQUE,
  nom_tipo_comprobante VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_tipo_comprobante)
);

-- -----------------------------------------------------
-- Table PEDIDO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PEDIDO (
  id_pedido INT NOT NULL UNIQUE,
  Id_user INT NOT NULL,
  fecha_pedido DATETIME NOT NULL,
  total_pedido INT NOT NULL,
  confirmación_entrega TINYINT NULL,
  id_estado INT NOT NULL,
  id_despacho INT NOT NULL,
  id_sucursal INT NULL,
  direc_desp VARCHAR(100) NULL,
  id_comuna_dep INT NULL,
  id_region_desp INT NULL,
  id_tipo_comprobante INT NOT NULL,
  rut_factura VARCHAR(9) NULL,
  razon_social VARCHAR(100) NULL,
  PRIMARY KEY (id_pedido, Id_user, id_estado, id_despacho, id_tipo_comprobante),
  CONSTRAINT fk_PEDIDO_USUARIO1
    FOREIGN KEY (Id_user)
    REFERENCES USUARIO (Id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_TIPO_DESPACHO1
    FOREIGN KEY (id_despacho)
    REFERENCES TIPO_DESPACHO (id_despacho)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_ESTADO_PEDIDO1
    FOREIGN KEY (id_estado)
    REFERENCES ESTADO_PEDIDO (id_estado)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_TIPO_COMPROBANTE1
    FOREIGN KEY (id_tipo_comprobante)
    REFERENCES TIPO_COMPROBANTE (id_tipo_comprobante)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table MEDIO_DE_PAGO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS MEDIO_DE_PAGO (
  id_medpago INT NOT NULL UNIQUE,
  nom_medpago VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_medpago)
  );

-- -----------------------------------------------------
-- Table PAGO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PAGO (
  id_pago INT NOT NULL UNIQUE,
  id_medpago INT NOT NULL,
  estado_pago TINYINT NOT NULL,
  fecha_pago DATETIME NOT NULL,
  monto_pago INT NOT NULL,
  id_pedido INT NOT NULL,
  PRIMARY KEY (id_pago, id_medpago, id_pedido),
  CONSTRAINT fk_PAGO_MEDIO_DE_PAGO1
    FOREIGN KEY (id_medpago)
    REFERENCES MEDIO_DE_PAGO (id_medpago)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PAGO_PEDIDO1
    FOREIGN KEY (id_pedido)
    REFERENCES PEDIDO (id_pedido)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table DETALLE_PEDIDO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DETALLE_PEDIDO (
  id_detalle INT NOT NULL UNIQUE,
  id_pedido INT NOT NULL,
  id_prod INT NOT NULL,
  cantidad_producto INT NOT NULL,
  PRIMARY KEY (id_detalle, id_pedido, id_prod),
  CONSTRAINT fk_DETALLE_PEDIDO_PEDIDO1
    FOREIGN KEY (id_pedido)
    REFERENCES PEDIDO (id_pedido)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_DETALLE_PEDIDO_PRODUCTO1
    FOREIGN KEY (id_prod)
    REFERENCES PRODUCTO (id_prod)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table NOTIFICACION (EMAIL)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS NOTIFICACION (
  id_notifi INT NOT NULL UNIQUE,
  id_user INT NOT NULL,
  motivo_notifi VARCHAR(20) NOT NULL,
  contenido_notifi VARCHAR(250) NOT NULL,
  fecha_notifi DATETIME NOT NULL,
  PRIMARY KEY (id_notifi)
);

-- -----------------------------------------------------
-- Table CARRITO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS CARRITO (
  id_carrito INT NOT NULL UNIQUE,
  fecha_carrito DATETIME NOT NULL,
  Id_user INT NOT NULL,
  PRIMARY KEY (id_carrito, Id_user),
  CONSTRAINT fk_CARRITO_USUARIO1
    FOREIGN KEY (Id_user)
    REFERENCES USUARIO (Id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table DETALLE_CARRITO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DETALLE_CARRITO (
  id_detcarrito INT NOT NULL UNIQUE,
  id_prod INT NOT NULL,
  id_carrito INT NOT NULL,
  cantidad_producto INT NOT NULL,
  PRIMARY KEY (id_detcarrito, id_prod, id_carrito),
  CONSTRAINT fk_DETALLE_CARRITO_PRODUCTO1
    FOREIGN KEY (id_prod)
    REFERENCES PRODUCTO (id_prod)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_DETALLE_CARRITO_CARRITO1
    FOREIGN KEY (id_carrito)
    REFERENCES CARRITO (id_carrito)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

INSERT INTO ROL_USER VALUES (1, 'Administrador');
INSERT INTO ROL_USER VALUES (2, 'Vendedor');
INSERT INTO ROL_USER VALUES (3, 'Bodeguero');
INSERT INTO ROL_USER VALUES (4, 'Contador');
INSERT INTO ROL_USER VALUES (5, 'Cliente');

INSERT INTO REGION VALUES (1, 'Arica y Parinacota');
INSERT INTO REGION VALUES (2, 'Tarapacá');
INSERT INTO REGION VALUES (3, 'Antofagasta');
INSERT INTO REGION VALUES (4, 'Atacama');
INSERT INTO REGION VALUES (5, 'Coquimbo');
INSERT INTO REGION VALUES (6, 'Valparaíso');
INSERT INTO REGION VALUES (7, 'Región del Libertador Gral. Bernardo O’Higgins');
INSERT INTO REGION VALUES (8, 'Región del Maule');
INSERT INTO REGION VALUES (9, 'Ñuble');
INSERT INTO REGION VALUES (10, 'Biobío');
INSERT INTO REGION VALUES (11, 'La Araucanía');
INSERT INTO REGION VALUES (12, 'Los Ríos');
INSERT INTO REGION VALUES (13, 'Los Lagos');
INSERT INTO REGION VALUES (14, 'Aysén');
INSERT INTO REGION VALUES (15, 'Magallanes');
INSERT INTO REGION VALUES (16, 'Región Metropolitana');

INSERT INTO COMUNA VALUES (1, 'Arica', 1);
INSERT INTO COMUNA VALUES (2, 'Putre', 1);
INSERT INTO COMUNA VALUES (3, 'Iquique', 2);
INSERT INTO COMUNA VALUES (4, 'Alto Hospicio', 2);
INSERT INTO COMUNA VALUES (5, 'Antofagasta', 3);
INSERT INTO COMUNA VALUES (6, 'Calama', 3);
INSERT INTO COMUNA VALUES (7, 'Copiapó', 4);
INSERT INTO COMUNA VALUES (8, 'Vallenar', 4);
INSERT INTO COMUNA VALUES (9, 'La Serena', 5);
INSERT INTO COMUNA VALUES (10, 'Coquimbo', 5);
INSERT INTO COMUNA VALUES (11, 'Valparaíso', 6);
INSERT INTO COMUNA VALUES (12, 'Viña del Mar', 6);
INSERT INTO COMUNA VALUES (13, 'Rancagua', 7);
INSERT INTO COMUNA VALUES (14, 'San Fernando', 7);
INSERT INTO COMUNA VALUES (15, 'Talca', 8);
INSERT INTO COMUNA VALUES (16, 'Curicó', 8);
INSERT INTO COMUNA VALUES (17, 'Chillán', 9);
INSERT INTO COMUNA VALUES (18, 'San Carlos', 9);
INSERT INTO COMUNA VALUES (19, 'Concepción', 10);
INSERT INTO COMUNA VALUES (20, 'Los Ángeles', 10);
INSERT INTO COMUNA VALUES (21, 'Temuco', 11);
INSERT INTO COMUNA VALUES (22, 'Villarrica', 11);
INSERT INTO COMUNA VALUES (23, 'Valdivia', 12);
INSERT INTO COMUNA VALUES (24, 'La Unión', 12);
INSERT INTO COMUNA VALUES (25, 'Puerto Montt', 13);
INSERT INTO COMUNA VALUES (26, 'Castro', 13);
INSERT INTO COMUNA VALUES (27, 'Coyhaique', 14);
INSERT INTO COMUNA VALUES (28, 'Puerto Aysén', 14);
INSERT INTO COMUNA VALUES (29, 'Punta Arenas', 15);
INSERT INTO COMUNA VALUES (30, 'Puerto Natales', 15);
INSERT INTO COMUNA VALUES (31, 'Santiago', 16);
INSERT INTO COMUNA VALUES (32, 'Puente Alto', 16);
INSERT INTO COMUNA VALUES (33, 'Las Condes', 16);
INSERT INTO COMUNA VALUES (34, 'Lo Barnechea', 16);

-- NO HAY direcciones reales de FERRAMAS solo se pusieron hipotéticas.
-- Región Metropolitana (ID Región: 16)
INSERT INTO SUCURSAL VALUES (1, 'Av. Vicuña Mackenna 1347, Santiago', 16);
INSERT INTO SUCURSAL VALUES (2, 'Av. Concha y Toro 10245, Puente Alto', 16);
INSERT INTO SUCURSAL VALUES (3, 'Av. Apoquindo 6410, Las Condes', 16);
INSERT INTO SUCURSAL VALUES (4, 'Camino a Farellones 14500, Lo Barnechea', 16);
-- Otras regiones
INSERT INTO SUCURSAL VALUES (5, 'Av. Colón 5965, Antofagasta', 3);     
INSERT INTO SUCURSAL VALUES (6, 'Camino a San Fernando 785, Curicó', 8);
INSERT INTO SUCURSAL VALUES (7, 'Ruta 5 Sur km 670, Puerto Montt', 13);

INSERT INTO MEDIO_DE_PAGO VALUES (1, 'Webpay');
INSERT INTO MEDIO_DE_PAGO VALUES (2, 'Transferencia');
INSERT INTO MEDIO_DE_PAGO VALUES (3, 'Pago en tienda');

INSERT INTO TIPO_DESPACHO VALUES (1, 'Retiro en tienda');
INSERT INTO TIPO_DESPACHO VALUES (2, 'Despacho a domicilio');

INSERT INTO TIPO_COMPROBANTE VALUES (1, 'Boleta');
INSERT INTO TIPO_COMPROBANTE VALUES (2, 'Factura');

Select * from region;
Select * from Comuna;
Select * from sucursal;
Select * from usuario;