from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name

class Role(models.Model):
    id_rol = models.IntegerField(primary_key=True)
    nom_rol = models.CharField(max_length=40, unique=True)

    class Meta:
        db_table = 'ROL_USER'
    
    def __str__(self):
        return self.nom_rol

class Region(models.Model):
    id_region = models.IntegerField(primary_key=True)
    nom_region = models.CharField(max_length=60, unique=True)

    class Meta:
        db_table = 'REGION'

    def __str__(self):
        return self.nom_region        

class Comuna(models.Model):
    id_comuna = models.IntegerField(primary_key=True)
    nom_comuna = models.CharField(max_length=60)
    region = models.ForeignKey('Region', on_delete=models.CASCADE, db_column='id_region')

    class Meta:
        db_table = 'COMUNA'
        unique_together = (('nom_comuna', 'region'),)

    def __str__(self):
        return self.nom_comuna

class Usuario(models.Model):
    id_user = models.AutoField(primary_key=True)
    nombre_user = models.CharField(max_length=60)
    apellido_user = models.CharField(max_length=60)
    rut_user = models.IntegerField(unique=True)
    dv_user = models.IntegerField()
    celular_user = models.IntegerField()
    pass_user = models.CharField(max_length=12)
    email_user = models.EmailField(max_length=100, unique=True)
    direccion_user = models.CharField(max_length=100)
    id_sucursal = models.IntegerField(null=True, blank=True)
    token = models.CharField(max_length=255, null=True, blank=True)
    estado_user = models.BooleanField()
    
    rol = models.ForeignKey(Role, on_delete=models.DO_NOTHING, db_column='id_rol')
    comuna = models.ForeignKey(Comuna, on_delete=models.DO_NOTHING, db_column='id_comuna')

    class Meta:
        db_table = 'USUARIO'
        unique_together = (('nombre_user', 'apellido_user', 'email_user'),)

    def __str__(self):
        return f'{self.nombre_user} {self.apellido_user}'

class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    direccion_sucursal = models.CharField(max_length=100)
    comuna = models.ForeignKey(Comuna, on_delete=models.CASCADE, db_column='id_comuna')

    class Meta:
        db_table = 'SUCURSAL'
        constraints = [
            models.UniqueConstraint(fields=['direccion_sucursal', 'comuna'], name='unique_direccion_comuna')
        ]

    def __str__(self):
        return self.direccion_sucursal

class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    sucursal = models.ForeignKey('Sucursal', on_delete=models.DO_NOTHING, db_column='id_sucursal')

    class Meta:
        db_table = 'INVENTARIO'
        verbose_name = 'Inventario'
        verbose_name_plural = 'Inventarios'

    def __str__(self):
        return f'Inventario {self.id_inventario}'

class CategoriaProducto(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nom_cat_prod = models.CharField(max_length=60)

    class Meta:
        db_table = 'CATEGORIA_PRODUCTO'
        verbose_name = 'Categoría de Producto'
        verbose_name_plural = 'Categorías de Producto'

    def __str__(self):
        return self.nom_cat_prod

class Producto(models.Model):
    id_prod = models.AutoField(primary_key=True)
    nom_prod = models.CharField(max_length=60)
    marca_prod = models.CharField(max_length=20)
    codigo_fabricante = models.IntegerField()
    precio_prod = models.IntegerField()
    estado_prod = models.BooleanField()
    foto_prod = models.BinaryField(null=True, blank=True)
    stock = models.IntegerField()
    inventario = models.ForeignKey('Inventario', on_delete=models.DO_NOTHING, db_column='id_inventario')
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.DO_NOTHING, db_column='id_categoria')

    class Meta:
        db_table = 'PRODUCTO'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        unique_together = (('nom_prod', 'marca_prod'),)

    def __str__(self):
        return f'{self.nom_prod} - {self.marca_prod}'

class TipoDespacho(models.Model):
    id_despacho = models.AutoField(primary_key=True)
    nom_despacho = models.CharField(max_length=20, unique=True)

    class Meta:
        db_table = 'TIPO_DESPACHO'
        verbose_name = 'Tipo de Despacho'
        verbose_name_plural = 'Tipos de Despacho'

    def __str__(self):
        return self.nom_despacho

class EstadoPedido(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nom_estado = models.CharField(max_length=20, unique=True)

    class Meta:
        db_table = 'ESTADO_PEDIDO'
        verbose_name = 'Estado de Pedido'
        verbose_name_plural = 'Estados de Pedido'

    def __str__(self):
        return self.nom_estado

class TipoComprobante(models.Model):
    id_tipo_comprobante = models.AutoField(primary_key=True)
    nom_tipo_comprobante = models.CharField(max_length=10, unique=True)

    class Meta:
        db_table = 'TIPO_COMPROBANTE'
        verbose_name = 'Tipo de Comprobante'
        verbose_name_plural = 'Tipos de Comprobante'

    def __str__(self):
        return self.nom_tipo_comprobante

class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.DO_NOTHING, db_column='Id_user')
    fecha_pedido = models.DateTimeField()
    fecha_entrega_stm = models.DateTimeField()
    total_pedido = models.IntegerField()
    confirmacion_entrega = models.BooleanField(null=True, blank=True, db_column='confirmación_entrega')
    estado = models.ForeignKey('EstadoPedido', on_delete=models.DO_NOTHING, db_column='id_estado')
    tipo_despacho = models.ForeignKey('TipoDespacho', on_delete=models.DO_NOTHING, db_column='id_despacho')
    sucursal = models.ForeignKey('Sucursal', on_delete=models.DO_NOTHING, db_column='id_sucursal', null=True, blank=True)
    direc_desp = models.CharField(max_length=100, null=True, blank=True)
    id_comuna_dep = models.IntegerField(null=True, blank=True)
    id_region_desp = models.IntegerField(null=True, blank=True)
    tipo_comprobante = models.ForeignKey('TipoComprobante', on_delete=models.DO_NOTHING, db_column='id_tipo_comprobante')
    rut_factura = models.CharField(max_length=9, null=True, blank=True)
    razon_social = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'PEDIDO'
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

    def __str__(self):
        return f'Pedido #{self.id_pedido} - Usuario {self.usuario_id}'

class MedioDePago(models.Model):
    id_medpago = models.AutoField(primary_key=True)
    nom_medpago = models.CharField(max_length=20, unique=True)

    class Meta:
        db_table = 'MEDIO_DE_PAGO'
        verbose_name = 'Medio de Pago'
        verbose_name_plural = 'Medios de Pago'

    def __str__(self):
        return self.nom_medpago

class Notificacion(models.Model):
    id_notifi = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.DO_NOTHING, db_column='id_user')
    motivo_notifi = models.CharField(max_length=20)
    contenido_notifi = models.CharField(max_length=250)
    fecha_notifi = models.DateTimeField()

    class Meta:
        db_table = 'NOTIFICACION'
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'

    def __str__(self):
        return f'Notificación #{self.id_notifi} - {self.motivo_notifi}'



class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)
    medio_pago = models.ForeignKey('MedioDePago', on_delete=models.DO_NOTHING, db_column='id_medpago')
    estado_pago = models.BooleanField()
    fecha_pago = models.DateTimeField()
    monto_pago = models.IntegerField()
    pedido = models.ForeignKey('Pedido', on_delete=models.DO_NOTHING, db_column='id_pedido')

    class Meta:
        db_table = 'PAGO'
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
        unique_together = (('medio_pago', 'pedido'),)

    def __str__(self):
        return f'Pago #{self.id_pago} - Pedido {self.pedido_id}'

class DetallePedido(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    pedido = models.ForeignKey('Pedido', on_delete=models.DO_NOTHING, db_column='id_pedido')
    producto = models.ForeignKey('Producto', on_delete=models.DO_NOTHING, db_column='id_prod')
    cantidad_producto = models.IntegerField()

    class Meta:
        db_table = 'DETALLE_PEDIDO'
        verbose_name = 'Detalle de Pedido'
        verbose_name_plural = 'Detalles de Pedido'
        unique_together = (('pedido', 'producto'),)

    def __str__(self):
        return f'{self.producto} x{self.cantidad_producto} - Pedido {self.pedido_id}'


class Carrito(models.Model):
    id_carrito = models.AutoField(primary_key=True)
    fecha_carrito = models.DateTimeField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='Id_user')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='id_prod')
    cantidad_producto = models.IntegerField()

    class Meta:
        db_table = 'CARRITO'
        unique_together = (('usuario', 'producto'),)
        verbose_name = 'Carrito'
        verbose_name_plural = 'Carritos'
    def __str__(self):
        return f'Carrito #{self.id_carrito} - {self.usuario.nombre_user} - {self.producto.nom_prod}'

