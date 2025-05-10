from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import *
#Aqui registramos los roles
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id_rol', 'nom_rol')
    search_fields = ('nom_rol',)

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id_region', 'nom_region')
    search_fields = ('nom_region',)

@admin.register(Comuna)
class ComunaAdmin(admin.ModelAdmin):
    list_display = ('id_comuna', 'nom_comuna', 'region')
    search_fields = ('nom_comuna',)
    list_filter = ('region',)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id_user', 'nombre_user', 'apellido_user', 'email_user', 'rol', 'comuna','id_sucursal')
    search_fields = ('nombre_user', 'apellido_user', 'email_user','id_sucursal')
    list_filter = ('rol', 'comuna', 'id_sucursal','estado_user')

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('id_sucursal', 'direccion_sucursal', 'comuna')
    search_fields = ('direccion_sucursal',)
    list_filter = ('comuna',)

@admin.register(Inventario)
class InventarioAdmin(admin.ModelAdmin):
    list_display = ('id_inventario', 'sucursal')
    search_fields = ('id_inventario',)
    list_filter = ('sucursal',)

@admin.register(CategoriaProducto)
class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'nom_cat_prod')
    search_fields = ('nom_cat_prod',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'id_prod', 'nom_prod', 'marca_prod',
        'codigo_fabricante', 'precio_prod',
        'estado_prod', 'stock', 'inventario', 'categoria'
    )
    search_fields = ('nom_prod', 'marca_prod', 'codigo_fabricante')
    list_filter = ('marca_prod', 'estado_prod', 'inventario', 'categoria')

@admin.register(TipoDespacho)
class TipoDespachoAdmin(admin.ModelAdmin):
    list_display = ('id_despacho', 'nom_despacho')
    search_fields = ('nom_despacho',)

@admin.register(EstadoPedido)
class EstadoPedidoAdmin(admin.ModelAdmin):
    list_display = ('id_estado', 'nom_estado')
    search_fields = ('nom_estado',)

@admin.register(TipoComprobante)
class TipoComprobanteAdmin(admin.ModelAdmin):
    list_display = ('id_tipo_comprobante', 'nom_tipo_comprobante')
    search_fields = ('nom_tipo_comprobante',)


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id_pedido', 'usuario', 'fecha_pedido', 'total_pedido',
        'confirmacion_entrega', 'estado', 'tipo_despacho',
        'tipo_comprobante'
    )
    search_fields = ('id_pedido', 'usuario__nombre_user', 'usuario__apellido_user')
    list_filter = ('estado', 'tipo_despacho', 'tipo_comprobante', 'confirmacion_entrega')

@admin.register(MedioDePago)
class MedioDePagoAdmin(admin.ModelAdmin):
    list_display = ('id_medpago', 'nom_medpago')
    search_fields = ('nom_medpago',)

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('id_notifi', 'usuario', 'motivo_notifi', 'fecha_notifi')
    search_fields = ('motivo_notifi', 'contenido_notifi', 'usuario__nombre_user')
    list_filter = ('motivo_notifi', 'fecha_notifi')


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('id_pago', 'pedido', 'medio_pago', 'estado_pago', 'fecha_pago', 'monto_pago')
    search_fields = ('pedido__id_pedido',)
    list_filter = ('medio_pago', 'estado_pago', 'fecha_pago')

@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('id_detalle', 'pedido', 'producto', 'cantidad_producto')
    search_fields = ('pedido__id_pedido', 'producto__nom_prod')
    list_filter = ('producto',)

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('id_carrito', 'usuario', 'producto', 'cantidad_producto', 'fecha_carrito')
    search_fields = ('usuario__nombre_user', 'producto__nom_prod')
    list_filter = ('fecha_carrito',)

