from django.db import models
#Modelo de prueba
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
#modelo de rol
class Role(models.Model):
    id_rol = models.IntegerField(primary_key=True)  # Lo que tenías en MySQL
    nom_rol = models.CharField(max_length=40)  # Lo que tenías en MySQL

    class Meta:
        db_table = 'ROL_USER'
    
    def __str__(self):
        return self.nom_rol
#modelo de region
class Region(models.Model):
    id_region = models.IntegerField(primary_key=True)
    nom_region = models.CharField(max_length=60)

    class Meta:
        db_table = 'REGION'

    def __str__(self):
        return self.nom_region        
#modelo de comuna
class Comuna(models.Model):
    id_comuna = models.IntegerField(primary_key=True)
    nom_comuna = models.CharField(max_length=60)
    region = models.ForeignKey('Region', on_delete=models.CASCADE, db_column='id_region')

    class Meta:
        db_table = 'COMUNA'

    def __str__(self):
        return self.nom_comuna
#modelo usuario
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
    token = models.CharField(max_length=255, null=True, blank=True)
    estado_user = models.BooleanField()
    
    rol = models.ForeignKey(
        Role,
        on_delete=models.DO_NOTHING,
        db_column='id_rol' 
    )
    comuna = models.ForeignKey(
        Comuna,
        on_delete=models.DO_NOTHING,
        db_column='id_comuna'
    )

    class Meta:
        db_table = 'USUARIO'
    
    def __str__(self):
        return f'{self.nombre_user} {self.apellido_user}'

#modelo sucursal
class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    direccion_sucursal = models.CharField(max_length=100)
    comuna = models.ForeignKey(
        Comuna, 
        on_delete=models.CASCADE,
        db_column='id_comuna' 
    )

    class Meta:
        db_table = 'SUCURSAL'  
        constraints = [
            models.UniqueConstraint(fields=['id_sucursal', 'comuna'], name='unique_sucursal_comuna')  
        ]

    def __str__(self):
        return self.direccion_sucursal

#modelo inventario
class Inventario(models.Model):
    id_inventario = models.IntegerField(primary_key=True)
    stock_disponible = models.IntegerField()
    
    sucursal = models.ForeignKey(
        'Sucursal',
        on_delete=models.DO_NOTHING,
        db_column='id_sucursal'
    )

    class Meta:
        db_table = 'INVENTARIO'
        unique_together = (('id_inventario', 'sucursal'),)
        verbose_name = 'Inventario'
        verbose_name_plural = 'Inventarios'

    def __str__(self):
        return f'Inventario {self.id_inventario} - Stock: {self.stock_disponible}'
#modelo item
class Producto(models.Model):
    id_prod = models.AutoField(primary_key=True) 
    nom_prod = models.CharField(max_length=60)
    marca_prod = models.CharField(max_length=20)
    codigo_fabricante = models.IntegerField()
    precio_prod = models.IntegerField()
    estado_prod = models.BooleanField()
    foto_prod = models.BinaryField(null=True, blank=True)

    inventario = models.ForeignKey(
        'Inventario',
        on_delete=models.DO_NOTHING,
        db_column='id_inventario'
    )

    class Meta:
        db_table = 'PRODUCTO'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f'{self.nom_prod} - {self.marca_prod}'
#modelo despacho
class TipoDespacho(models.Model):
    id_despacho = models.AutoField(primary_key=True)
    nom_despacho = models.CharField(max_length=20)

    class Meta:
        db_table = 'TIPO_DESPACHO'
        verbose_name = 'Tipo de Despacho'
        verbose_name_plural = 'Tipos de Despacho'

    def __str__(self):
        return self.nom_despacho

#estado pedido
class EstadoPedido(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nom_estado = models.CharField(max_length=20)

    class Meta:
        db_table = 'ESTADO_PEDIDO'
        verbose_name = 'Estado de Pedido'
        verbose_name_plural = 'Estados de Pedido'

    def __str__(self):
        return self.nom_estado

#comprobante
class TipoComprobante(models.Model):
    id_tipo_comprobante = models.AutoField(primary_key=True)
    nom_tipo_comprobante = models.CharField(max_length=10)

    class Meta:
        db_table = 'TIPO_COMPROBANTE'
        verbose_name = 'Tipo de Comprobante'
        verbose_name_plural = 'Tipos de Comprobante'

    def __str__(self):
        return self.nom_tipo_comprobante

#modelo pedido
class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        'Usuario',
        on_delete=models.DO_NOTHING,
        db_column='Id_user'
    )
    fecha_pedido = models.DateTimeField()
    total_pedido = models.IntegerField()
    confirmacion_entrega = models.BooleanField(null=True, blank=True)
    estado = models.ForeignKey(
        'EstadoPedido',
        on_delete=models.DO_NOTHING,
        db_column='id_estado'
    )
    tipo_despacho = models.ForeignKey(
        'TipoDespacho',
        on_delete=models.DO_NOTHING,
        db_column='id_despacho'
    )
    sucursal = models.ForeignKey(
        'Sucursal',
        on_delete=models.DO_NOTHING,
        db_column='id_sucursal',
        null=True,
        blank=True
    )
    direc_desp = models.CharField(max_length=100, null=True, blank=True)
    id_comuna_dep = models.IntegerField(null=True, blank=True)
    id_region_desp = models.IntegerField(null=True, blank=True)
    tipo_comprobante = models.ForeignKey(
        'TipoComprobante',
        on_delete=models.DO_NOTHING,
        db_column='id_tipo_comprobante'
    )
    rut_factura = models.CharField(max_length=9, null=True, blank=True)
    razon_social = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'PEDIDO'
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

    def __str__(self):
        return f'Pedido #{self.id_pedido} - Usuario {self.usuario_id}'


#medio de pago
class MedioDePago(models.Model):
    id_medpago = models.AutoField(primary_key=True)
    nom_medpago = models.CharField(max_length=20)

    class Meta:
        db_table = 'MEDIO_DE_PAGO'
        verbose_name = 'Medio de Pago'
        verbose_name_plural = 'Medios de Pago'

    def __str__(self):
        return self.nom_medpago
