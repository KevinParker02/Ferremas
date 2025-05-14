from django.urls import path
from .views import *

urlpatterns = [
    path('items/', ItemListCreate.as_view(), name='item-list-create'),
    path('login/', login_view),
    path('register/', register_view),
    path('comunas/', listar_comunas),
    path('recuperar/', recuperar_view),
    path('regiones/', listar_regiones),
    ##PARA LA VISTA ADMIN (Aún en proceso) 
    path('sucursales/', listar_sucursales),
    path('roles/',      listar_roles),
    path('empleados/',  crear_empleado),
    path('usuarios/', listar_usuarios),
    path('usuarios/<int:id_user>/toggle_estado/', toggle_estado),
    path('usuarios/<int:id_user>/', eliminar_usuario),

    path('reset_password/', reset_password_view),
    path('productos/', listar_productos, name='listar_productos'),
    ##esto es para el carrito
    path('carrito/agregar/', agregar_al_carrito),
    path('carrito/<int:id_usuario>/', obtener_carrito_usuario),
    path('carrito/actualizar/', actualizar_cantidad_carrito),
    path('carrito/eliminar/', eliminar_producto_carrito),
    path('carrito/vaciar/<int:id_usuario>/', vaciar_carrito_usuario),

    ##PARA BODEGA
    path('categorias/', listar_categorias),
    path('sucursales/', listar_sucursales),
    path('producto/crear/', crear_producto),

    ##PARA VENDEDOR
    path('pedidos/', listar_pedidos),
    path('pedidos/<int:id_pedido>/estado/',actualizar_estado_pedido),

    ##PARA PAGO
    path('webpay/iniciar/', iniciar_pago, name='iniciar_pago'),
    path('webpay/respuesta/', respuesta_pago, name='respuesta_pago'),
    path('stripe/crear-sesion/', crear_sesion_pago),
]