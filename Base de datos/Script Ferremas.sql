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
  Id_user INT NOT NULL UNIQUE auto_increment,
  nombre_user VARCHAR(60) NOT NULL,
  apellido_user VARCHAR(60) NOT NULL,
  rut_user INT NOT NULL UNIQUE,
  dv_user INT NOT NULL,
  celular_user INT NOT NULL,
  pass_user VARCHAR(130) NOT NULL,
  email_user VARCHAR(100) NOT NULL UNIQUE,
  direccion_user VARCHAR(100) NOT NULL,
  id_sucursal INT NULL,
  token VARCHAR(255) NULL,
  estado_user TINYINT NOT NULL,
  id_rol INT NOT NULL,
  id_comuna INT NOT NULL,
  PRIMARY KEY (Id_user, id_rol, id_comuna),
  CONSTRAINT fk_USUARIO_ROL_USER
    FOREIGN KEY (id_rol)
    REFERENCES ROL_USER (id_rol)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_USUARIO_COMUNA1
    FOREIGN KEY (id_comuna)
    REFERENCES COMUNA (id_comuna)
    ON DELETE CASCADE
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
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table INVENTARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS INVENTARIO (
  id_inventario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_sucursal INT NOT NULL,
  CONSTRAINT fk_INVENTARIO_SUCURSAL
    FOREIGN KEY (id_sucursal)
    REFERENCES SUCURSAL (id_sucursal)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table PRODUCTO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PRODUCTO (
  id_prod INT NOT NULL PRIMARY KEY auto_increment,
  nom_prod VARCHAR(60) NOT NULL,
  marca_prod VARCHAR(20) NOT NULL,
  codigo_fabricante INT NOT NULL,
  precio_prod INT NOT NULL,
  Estado_prod TINYINT NOT NULL,
  foto_prod BLOB NULL,
  stock INT NOT NULL,
  id_inventario INT NOT NULL,
  Id_categoria INT NOT NULL,
  CONSTRAINT fk_PRODUCTO_INVENTARIO
    FOREIGN KEY (id_inventario)
    REFERENCES INVENTARIO (id_inventario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PRODUCTO_CATEGORIA
    FOREIGN KEY (Id_categoria)
    REFERENCES CATEGORIA_PRODUCTO (Id_categoria)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table CATEGORIA_PRODUCTO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUCTO (
  Id_categoria INT NOT NULL PRIMARY KEY auto_increment,
  nom_cat_prod VARCHAR(60) NOT NULL
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
  id_pedido INT NOT NULL UNIQUE auto_increment,
  Id_user INT NOT NULL,
  fecha_pedido DATETIME NOT NULL,
  fecha_entrega_stm DATETIME NOT NULL,
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
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_TIPO_DESPACHO1
    FOREIGN KEY (id_despacho)
    REFERENCES TIPO_DESPACHO (id_despacho)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_ESTADO_PEDIDO1
    FOREIGN KEY (id_estado)
    REFERENCES ESTADO_PEDIDO (id_estado)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PEDIDO_TIPO_COMPROBANTE1
    FOREIGN KEY (id_tipo_comprobante)
    REFERENCES TIPO_COMPROBANTE (id_tipo_comprobante)
    ON DELETE CASCADE
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
  id_pago INT NOT NULL UNIQUE auto_increment,
  id_medpago INT NOT NULL,
  estado_pago TINYINT NOT NULL,
  fecha_pago DATETIME NOT NULL,
  monto_pago INT NOT NULL,
  id_pedido INT NOT NULL,
  PRIMARY KEY (id_pago, id_medpago, id_pedido),
  CONSTRAINT fk_PAGO_MEDIO_DE_PAGO1
    FOREIGN KEY (id_medpago)
    REFERENCES MEDIO_DE_PAGO (id_medpago)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PAGO_PEDIDO1
    FOREIGN KEY (id_pedido)
    REFERENCES PEDIDO (id_pedido)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table DETALLE_PEDIDO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DETALLE_PEDIDO (
  id_detalle INT NOT NULL UNIQUE auto_increment,
  id_pedido INT NOT NULL,
  id_prod INT NOT NULL,
  cantidad_producto INT NOT NULL,
  PRIMARY KEY (id_detalle, id_pedido, id_prod),
  CONSTRAINT fk_DETALLE_PEDIDO_PEDIDO1
    FOREIGN KEY (id_pedido)
    REFERENCES PEDIDO (id_pedido)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_DETALLE_PEDIDO_PRODUCTO1
    FOREIGN KEY (id_prod)
    REFERENCES PRODUCTO (id_prod)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table NOTIFICACION (EMAIL)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS NOTIFICACION (
  id_notifi INT NOT NULL UNIQUE auto_increment,
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
  id_carrito INT NOT NULL UNIQUE auto_increment,
  fecha_carrito DATETIME NOT NULL,
  Id_user INT NOT NULL,
  id_prod INT NOT NULL,
  cantidad_producto INT NOT NULL,
  PRIMARY KEY (id_carrito, Id_user, id_prod),
  CONSTRAINT fk_CARRITO_USUARIO1
    FOREIGN KEY (Id_user)
    REFERENCES USUARIO (Id_user)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_CARRITO_PRODUCTO
    FOREIGN KEY (id_prod)
    REFERENCES PRODUCTO (id_prod)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- TRIGGERS
-- Para insertar el detalle del pedido
DELIMITER $$
CREATE TRIGGER trg_insertar_det_pedido
AFTER INSERT ON PEDIDO
FOR EACH ROW
BEGIN
  INSERT INTO DETALLE_PEDIDO (
    id_pedido,
    id_prod,
    cantidad_producto
  )
  SELECT
    NEW.id_pedido,
    c.id_prod,
    c.cantidad_producto
  FROM CARRITO AS c
  WHERE c.Id_user = NEW.Id_user;
END$$
DELIMITER ;

-- Para restar stock y vaciar el carrito.
DELIMITER $$
CREATE TRIGGER trg_actualizar_stock_y_limpiar_carrito
AFTER INSERT ON PEDIDO
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_id_prod INT;
    DECLARE v_cantidad INT;

    DECLARE cur CURSOR FOR
        SELECT id_prod, cantidad_producto
        FROM CARRITO
        WHERE id_user = NEW.id_user;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_id_prod, v_cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;

        UPDATE PRODUCTO
        SET stock = stock - v_cantidad
        WHERE id_prod = v_id_prod;
    END LOOP;
    
    CLOSE cur;

    DELETE FROM CARRITO
    WHERE id_user = NEW.id_user;
END$$
DELIMITER ;

INSERT INTO ROL_USER VALUES (11, 'Administrador');
INSERT INTO ROL_USER VALUES (21, 'Vendedor');
INSERT INTO ROL_USER VALUES (31, 'Bodeguero');
INSERT INTO ROL_USER VALUES (41, 'Contador');
INSERT INTO ROL_USER VALUES (51, 'Cliente');

INSERT INTO REGION VALUES (10, 'Arica y Parinacota');
INSERT INTO REGION VALUES (20, 'Tarapacá');
INSERT INTO REGION VALUES (30, 'Antofagasta');
INSERT INTO REGION VALUES (40, 'Atacama');
INSERT INTO REGION VALUES (50, 'Coquimbo');
INSERT INTO REGION VALUES (60, 'Valparaíso');
INSERT INTO REGION VALUES (70, 'Región del Libertador Gral. Bernardo O’Higgins');
INSERT INTO REGION VALUES (80, 'Región del Maule');
INSERT INTO REGION VALUES (90, 'Ñuble');
INSERT INTO REGION VALUES (100, 'Biobío');
INSERT INTO REGION VALUES (110, 'La Araucanía');
INSERT INTO REGION VALUES (120, 'Los Ríos');
INSERT INTO REGION VALUES (130, 'Los Lagos');
INSERT INTO REGION VALUES (140, 'Aysén');
INSERT INTO REGION VALUES (150, 'Magallanes');
INSERT INTO REGION VALUES (160, 'Región Metropolitana');

INSERT INTO COMUNA VALUES (15, 'Arica', 10);
INSERT INTO COMUNA VALUES (25, 'Putre', 10);
INSERT INTO COMUNA VALUES (35, 'Iquique', 20);
INSERT INTO COMUNA VALUES (45, 'Alto Hospicio', 20);
INSERT INTO COMUNA VALUES (55, 'Antofagasta', 30);
INSERT INTO COMUNA VALUES (65, 'Calama', 30);
INSERT INTO COMUNA VALUES (75, 'Copiapó', 40);
INSERT INTO COMUNA VALUES (85, 'Vallenar', 40);
INSERT INTO COMUNA VALUES (95, 'La Serena', 50);
INSERT INTO COMUNA VALUES (105, 'Coquimbo', 50);
INSERT INTO COMUNA VALUES (115, 'Valparaíso', 60);
INSERT INTO COMUNA VALUES (125, 'Viña del Mar', 60);
INSERT INTO COMUNA VALUES (135, 'Rancagua', 70);
INSERT INTO COMUNA VALUES (145, 'San Fernando', 70);
INSERT INTO COMUNA VALUES (155, 'Talca', 80);
INSERT INTO COMUNA VALUES (165, 'Curicó', 80);
INSERT INTO COMUNA VALUES (175, 'Chillán', 90);
INSERT INTO COMUNA VALUES (185, 'San Carlos', 90);
INSERT INTO COMUNA VALUES (195, 'Concepción', 100);
INSERT INTO COMUNA VALUES (205, 'Los Ángeles', 100);
INSERT INTO COMUNA VALUES (215, 'Temuco', 110);
INSERT INTO COMUNA VALUES (225, 'Villarrica', 110);
INSERT INTO COMUNA VALUES (235, 'Valdivia', 120);
INSERT INTO COMUNA VALUES (245, 'La Unión', 120);
INSERT INTO COMUNA VALUES (255, 'Puerto Montt', 130);
INSERT INTO COMUNA VALUES (265, 'Castro', 130);
INSERT INTO COMUNA VALUES (275, 'Coyhaique', 140);
INSERT INTO COMUNA VALUES (285, 'Puerto Aysén', 140);
INSERT INTO COMUNA VALUES (295, 'Punta Arenas', 150);
INSERT INTO COMUNA VALUES (305, 'Puerto Natales', 150);
INSERT INTO COMUNA VALUES (315, 'Santiago', 160);
INSERT INTO COMUNA VALUES (325, 'Puente Alto', 160);
INSERT INTO COMUNA VALUES (335, 'Las Condes', 160);
INSERT INTO COMUNA VALUES (345, 'Lo Barnechea', 160);

-- NO HAY direcciones reales de FERRAMAS solo se pusieron hipotéticas.
-- Región Metropolitana
INSERT INTO SUCURSAL VALUES (1, 'Av. Vicuña Mackenna 1347, Santiago', 315);
INSERT INTO SUCURSAL VALUES (2, 'Av. Concha y Toro 10245, Puente Alto', 325);
INSERT INTO SUCURSAL VALUES (3, 'Av. Apoquindo 6410, Las Condes', 335);
INSERT INTO SUCURSAL VALUES (4, 'Camino a Farellones 14500, Lo Barnechea', 345);
-- Otras regiones
INSERT INTO SUCURSAL VALUES (5, 'Av. Colón 5965, Antofagasta', 55);     
INSERT INTO SUCURSAL VALUES (6, 'Camino a San Fernando 785, Curicó', 165);
INSERT INTO SUCURSAL VALUES (7, 'Ruta 5 Sur km 670, Puerto Montt', 255);

INSERT INTO MEDIO_DE_PAGO VALUES (10, 'Webpay');
INSERT INTO MEDIO_DE_PAGO VALUES (20, 'Pago en tienda');

INSERT INTO TIPO_DESPACHO VALUES (100, 'Retiro en tienda');
INSERT INTO TIPO_DESPACHO VALUES (200, 'Despacho a domicilio');

INSERT INTO TIPO_COMPROBANTE VALUES (1, 'Boleta');
INSERT INTO TIPO_COMPROBANTE VALUES (2, 'Factura');

-- insert inventario
INSERT INTO INVENTARIO VALUES (100,1);
INSERT INTO INVENTARIO VALUES (200,2);
INSERT INTO INVENTARIO VALUES (300,3);
INSERT INTO INVENTARIO VALUES (400,4);
INSERT INTO INVENTARIO VALUES (500,5);  
INSERT INTO INVENTARIO VALUES (600,6);
INSERT INTO INVENTARIO VALUES (700,7);

INSERT INTO CATEGORIA_PRODUCTO VALUES (10, 'Herramientas Manuales');
INSERT INTO CATEGORIA_PRODUCTO VALUES (20, 'Materiales Básicos');
INSERT INTO CATEGORIA_PRODUCTO VALUES (30, 'Equipos de Seguridad');

-- Estados del pedido
INSERT INTO estado_pedido (id_estado, nom_estado) VALUES
(1, 'Pendiente'),
(2, 'Pagado'),
(3, 'Enviado'),
(4, 'Entregado'),
(5, 'Confirmado'),
(6, 'Preparación'),
(7, 'Completado');

INSERT INTO USUARIO (
    id_user, nombre_user, apellido_user, rut_user, dv_user, celular_user, pass_user,
    email_user, direccion_user, id_sucursal, token, estado_user, id_rol, id_comuna
) VALUES
(1, 'Admin', 'sas', 12345678, 9, 33333333,'pbkdf2_sha256$1000000$GwkrftJxGU6Pdt3pbvCiOH$vJMWWPVuDUBlvHnP/ofApV0a7yLoSfMEaDnVCh7nysg=', 'adminferremas@gmail.com', 'en mi casa', 3, NULL, 1, 11, 315),
(2, 'Luciano', 'Rivera', 12345677, 1, 26011754,'pbkdf2_sha256$1000000$GwkrftJxGU6Pdt3pbvCiOH$vJMWWPVuDUBlvHnP/ofApV0a7yLoSfMEaDnVCh7nysg=', 'Kev.vivanco@duocuc.cl', 'no seé Xd', 3, NULL, 1, 51, 335),
(3, 'Vendedor', 'Condes', 12345688, 5, 55555555,'pbkdf2_sha256$1000000$GwkrftJxGU6Pdt3pbvCiOH$vJMWWPVuDUBlvHnP/ofApV0a7yLoSfMEaDnVCh7nysg=', 'vendedorcondes5@gmail.com', 'no sabo', 3, NULL, 1, 21, 335),
(4, 'Bodega', 'Condes', 12345699, 4, 99999999,'pbkdf2_sha256$1000000$GwkrftJxGU6Pdt3pbvCiOH$vJMWWPVuDUBlvHnP/ofApV0a7yLoSfMEaDnVCh7nysg=', 'BodegaCondes4@gmail.com', 'Las Condes', 3, NULL, 1, 31, 335),
(5, 'Contador', 'Condes', 12345655, 2, 11111111,'pbkdf2_sha256$1000000$GwkrftJxGU6Pdt3pbvCiOH$vJMWWPVuDUBlvHnP/ofApV0a7yLoSfMEaDnVCh7nysg=', 'ContadorCondes5@gmail.com', 'El que cuenta', 3, NULL, 1, 41, 335);

USE FERREMAS;
SELECT * FROM USUARIO;
SELECT * FROM PRODUCTO;
SELECT * FROM INVENTARIO;
SELECT * FROM ROL_USER;