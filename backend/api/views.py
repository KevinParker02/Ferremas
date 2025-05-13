from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer
from api.models import *;
from django.contrib.auth.hashers import make_password #Para Crear
from django.contrib.auth.hashers import check_password #Para Validar
import traceback
from django.utils import timezone
import random
import string
from django.core.mail import send_mail
from .models import Usuario, Sucursal, Role
from django.db.models import Q, CharField
from django.shortcuts import get_object_or_404
from django.db.models.functions import Cast

class ItemListCreate(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

#Inicio de sesión
@api_view(['POST'])
def login_view(request):
    correo = request.data.get('usuario')
    password = request.data.get('password')

    try:
        user = Usuario.objects.get(email_user=correo)
        if check_password(password, user.pass_user):
            return Response({
                'mensaje': 'Login correcto',
                'usuario': {
                    'id_user': user.id_user,
                    'nombre_user': user.nombre_user,
                    'email_user': user.email_user,
                    'rol': {
                        'id': user.rol.id_rol,
                        'nombre': user.rol.nom_rol
                    },
                    "id_sucursal": user.id_sucursal,
                    "estado_user": user.estado_user,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

#Registro
@api_view(['POST'])
def register_view(request):
    data = request.data
    try:
        nuevo_usuario = Usuario.objects.create(
            nombre_user=data['nombre_user'],
            apellido_user=data['apellido_user'],
            rut_user=data['rut_user'],
            dv_user=data['dv_user'],
            celular_user=data['celular_user'],
            pass_user=make_password(data['password']),
            email_user=data['email_user'],
            direccion_user=data['direccion_user'],
            estado_user=True,
            rol_id=data['rol_id'],         
            comuna_id=data['comuna_id'], 
            id_sucursal= data['id_sucursal'],
        )
        return Response({'mensaje': 'Usuario registrado correctamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#Obtener comunas
@api_view(['GET'])
def listar_comunas(request):
    comunas = Comuna.objects.all().values('id_comuna', 'nom_comuna', 'region_id')
    return Response(list(comunas))

#Obtener regiones
@api_view(['GET'])
def listar_regiones(request):
    regiones = Region.objects.all().values('id_region', 'nom_region')
    return Response(list(regiones))

@api_view(['POST'])
def recuperar_view(request):
    email = request.data.get('email')

    try:
        user = Usuario.objects.get(email_user=email)
        token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        user.token = token
        user.save()

        # Aquí iría la integración con NodeMailer (desde backend Node)
        # Suponiendo que envías desde Django por ahora:
        send_mail(
            subject='Recuperación de contraseña Ferremas',
            message=f'Tu código de recuperación es: {token}',
            from_email='playtab.app2024@gmail.com',
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({'mensaje': 'Token enviado por correo'})
    except Usuario.DoesNotExist:
        return Response({'error': 'Correo no registrado'}, status=404)
    
@api_view(['POST'])
def reset_password_view(request):
    email = request.data.get('email')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if new_password != confirm_password:
        return Response({'error': 'Las contraseñas no coinciden'}, status=400)

    try:
        user = Usuario.objects.get(email_user=email, token=token)
        user.pass_user = make_password(new_password)
        user.token = None  # Elimina el token para que no pueda usarse de nuevo
        user.save()
        return Response({'mensaje': 'Contraseña restablecida correctamente'})
    except Usuario.DoesNotExist:
        return Response({'error': 'Token inválido o usuario no encontrado'}, status=404)

@api_view(['GET'])
def listar_productos(request):
    sucursal_id = request.query_params.get('sucursal', None)

    qs = Producto.objects.select_related('categoria', 'inventario__sucursal').all()

    if sucursal_id is not None:
        qs = qs.filter(inventario__sucursal_id=sucursal_id)

    producto_list = []
    for prod in qs:
        foto_base64 = None
        if prod.foto_prod:
            import base64
            foto_base64 = base64.b64encode(prod.foto_prod).decode('utf-8')

        producto_list.append({
            'id_prod': prod.id_prod,
            'nom_prod': prod.nom_prod,
            'marca_prod': prod.marca_prod,
            'precio_prod': prod.precio_prod,
            'stock': prod.stock,
            'estado_prod': prod.estado_prod,
            'categoria__nom_cat_prod': prod.categoria.nom_cat_prod,
            'inventario__sucursal_id': prod.inventario.sucursal_id,
            'foto_prod': foto_base64
        })

    return Response(producto_list)

#endpoint agregar al carrito
@api_view(['POST'])
def agregar_al_carrito(request):
    try:
        print("📦 DATA RECIBIDA:", request.data)

        id_usuario = request.data.get('id_usuario')
        id_producto = request.data.get('id_producto')
        cantidad = int(request.data.get('cantidad'))

        print("👉 id_usuario:", id_usuario)
        print("👉 id_producto:", id_producto)
        print("👉 cantidad:", cantidad)

        usuario = Usuario.objects.get(id_user=id_usuario)
        producto = Producto.objects.get(id_prod=id_producto)

        carrito_item, creado = Carrito.objects.get_or_create(
            usuario=usuario,
            producto=producto,
            defaults={'cantidad_producto': cantidad, 'fecha_carrito': timezone.now()}
        )

        if not creado:
            carrito_item.cantidad_producto += cantidad
            carrito_item.fecha_carrito = timezone.now()
            carrito_item.save()

        return Response({'mensaje': 'Producto agregado al carrito'}, status=status.HTTP_200_OK)

    except Exception as e:
        traceback.print_exc()  # ⬅️ Muestra el error exacto en consola
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


#listar al carrito
@api_view(['GET'])
def obtener_carrito_usuario(request, id_usuario):
    try:
        carrito = Carrito.objects.filter(usuario__id_user=id_usuario).select_related('producto')

        if not carrito.exists():
            return Response({'mensaje': 'Carrito vacío'}, status=status.HTTP_200_OK)

        data = []
        for item in carrito:
            data.append({
                'id_carrito': item.id_carrito,
                'id_producto': item.producto.id_prod,
                'nombre_producto': item.producto.nom_prod,
                'marca': item.producto.marca_prod,
                'precio': item.producto.precio_prod,
                'cantidad': item.cantidad_producto,
                'fecha_agregado': item.fecha_carrito
            })

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#actualizar cantidad del carrito
@api_view(['PUT'])
def actualizar_cantidad_carrito(request):
    try:
        id_usuario = request.data.get('id_usuario')
        id_producto = request.data.get('id_producto')
        nueva_cantidad = request.data.get('cantidad')

        if not id_usuario or not id_producto or nueva_cantidad is None:
            return Response({'error': 'Datos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

        nueva_cantidad = int(nueva_cantidad)

        carrito_item = Carrito.objects.get(
            usuario__id_user=id_usuario,
            producto__id_prod=id_producto
        )

        if nueva_cantidad <= 0:
            carrito_item.delete()
            return Response(
                {'mensaje': 'Producto eliminado del carrito por cantidad <= 0'},
                status=status.HTTP_200_OK
            )

        carrito_item.cantidad_producto = nueva_cantidad
        carrito_item.fecha_carrito = timezone.now()
        carrito_item.save()

        return Response({'mensaje': 'Cantidad actualizada'}, status=status.HTTP_200_OK)

    except Carrito.DoesNotExist:
        return Response({'error': 'Producto no encontrado en el carrito'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        
#eliminar del carrito
@api_view(['DELETE'])
def eliminar_producto_carrito(request):
    try:
        id_usuario = request.data.get('id_usuario')
        id_producto = request.data.get('id_producto')
        
        carrito_item = Carrito.objects.get(usuario__id_user=id_usuario, producto__id_prod=id_producto)
        carrito_item.delete()

        return Response({'mensaje': 'Producto eliminado del carrito'}, status=status.HTTP_200_OK)

    except Carrito.DoesNotExist:
        return Response({'error': 'Producto no encontrado en el carrito'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#vaciar el carrou
@api_view(['DELETE'])
def vaciar_carrito_usuario(request, id_usuario):
    try:
        items_eliminados, _ = Carrito.objects.filter(usuario__id_user=id_usuario).delete()

        return Response({'mensaje': f'{items_eliminados} productos eliminados del carrito'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
##PARA LA VISTA ADMIN   
@api_view(['GET'])
def listar_sucursales(request):
    qs = Sucursal.objects.all()
    data = [
        {
            "id_sucursal": s.id_sucursal,
            "direccion_sucursal": s.direccion_sucursal,
            "id_comuna": s.comuna_id
        }
        for s in qs
    ]
    return Response(data)


@api_view(['GET'])
def listar_roles(request):

    qs = Role.objects.exclude(id_rol=51)
    data = [
        {
            "id_rol": r.id_rol,
            "nom_rol": r.nom_rol
        }
        for r in qs
    ]
    return Response(data)


@api_view(['POST'])
def crear_empleado(request):
    data = request.data.copy()

    try:
        sucursal_id = int(data.get('id_sucursal'))
    except (TypeError, ValueError):
        return Response({"error": "id_sucursal inválido"}, status=400)

    # 1) Obtener la sucursal y su comuna
    sucursal = get_object_or_404(Sucursal, pk=sucursal_id)

    # 2) Inyectar el entero de la comuna
    comuna_id = sucursal.comuna_id
    data['comuna_id'] = comuna_id

    hashed = make_password(data['password'])
    data['password_hashed'] = hashed

    # 3) Crear el usuario
    try:
        usuario = Usuario.objects.create(
            nombre_user    = data['nombre_user'],
            apellido_user  = data['apellido_user'],
            rut_user       = data['rut_user'],
            dv_user        = data['dv_user'],
            celular_user   = data['celular_user'],
            pass_user      = hashed,   
            email_user     = data['email_user'],
            direccion_user = data['direccion_user'],
            estado_user    = True,
            rol_id         = int(data['rol_id']),
            id_sucursal    = sucursal_id,
            comuna_id      = comuna_id,           
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    return Response({
        "id_user": usuario.id_user,
        "nombre":  f"{usuario.nombre_user} {usuario.apellido_user}"
    }, status=201)

@api_view(['GET'])
def listar_usuarios(request):
    # 1) Partimos de un QS donde agregamos rut_str como texto
    qs = Usuario.objects.annotate(
        rut_str=Cast('rut_user', CharField())
    )

    q = request.query_params.get('search', '').strip()
    if q:
        # buscamos en nombre/apellido
        filtros = Q(nombre_user__icontains=q) | Q(apellido_user__icontains=q)
        # buscamos en la versión texto del rut
        filtros |= Q(rut_str__icontains=q)

        # también si escriben con guion: "12345678-9"
        if '-' in q:
            num, dv = q.split('-', 1)
            if num.isdigit():
                filtros |= Q(rut_user=int(num))
            if dv:
                filtros |= Q(dv_user__iexact=dv.upper())

        qs = qs.filter(filtros)

    # filtro por sucursal igual que antes
    suc = request.query_params.get('sucursal')
    if suc and suc.isdigit():
        qs = qs.filter(id_sucursal=int(suc))

    # serializamos
    data = [{
        'id_user':       u.id_user,
        'nombre_user':   u.nombre_user,
        'apellido_user': u.apellido_user,
        'rut_user':      u.rut_user,
        'dv_user':       u.dv_user,
        'nom_rol':       u.rol.nom_rol,
        'estado_user':   u.estado_user,
        'email_user':    u.email_user,
        'direccion_user':u.direccion_user,
        'id_sucursal':   u.id_sucursal,
    } for u in qs.order_by('nombre_user')]

    return Response(data)

@api_view(['POST'])
def toggle_estado(request, id_user):
    usuario = get_object_or_404(Usuario, pk=id_user)
    usuario.estado_user = not usuario.estado_user
    usuario.save()
    return Response({'estado_user': usuario.estado_user})

@api_view(['DELETE'])
def eliminar_usuario(request, id_user):

    usuario = get_object_or_404(Usuario, pk=id_user)
    usuario.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

##PARA LA VISTA de bodega
@api_view(['GET'])
def listar_categorias(request):
    qs = CategoriaProducto.objects.all()
    data = [
        {
            "id_categoria": c.id_categoria,
            "nom_cat_prod": c.nom_cat_prod
        }
        for c in qs
    ]
    return Response(data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def crear_producto(request):

    # 1) Campos obligatorios
    id_user = request.data.get('id_user')
    if not id_user:
        return Response({'error': 'Falta id_user'}, status=status.HTTP_400_BAD_REQUEST)

    # 2) Obtengo usuario e inventario
    usuario   = get_object_or_404(Usuario, pk=id_user)
    inventario = get_object_or_404(Inventario, sucursal_id=usuario.id_sucursal)

    # 3) Busco categoría
    categoria = get_object_or_404(CategoriaProducto, pk=request.data.get('id_categoria'))

    # 4) Leo el archivo de imagen
    foto_file = request.FILES.get('foto_prod', None)
    foto_bytes = foto_file.read() if foto_file else None

    # 5) Creo el producto
    producto = Producto.objects.create(
        nom_prod            = request.data.get('nom_prod'),
        marca_prod          = request.data.get('marca_prod'),
        codigo_fabricante   = request.data.get('codigo_fabricante'),
        precio_prod         = request.data.get('precio_prod'),
        estado_prod         = True,
        stock               = request.data.get('stock'),
        inventario          = inventario,
        categoria           = categoria,
        foto_prod           = foto_bytes
    )

    return Response({
        'success': True,
        'id_prod': producto.id_prod
    }, status=status.HTTP_201_CREATED)


#pago
@api_view(['POST'])
def iniciar_pago(request):
    id_usuario = request.data.get('id_usuario')

    # Calcular total desde el carrito
    items = Carrito.objects.filter(usuario__id_user=id_usuario)
    total = sum(item.producto.precio_prod * item.cantidad_producto for item in items)

    # Llamar a Webpay (o simularlo) y obtener una URL de pago
    # Aquí debería ir tu integración real con Transbank
    url_pago = f"http://localhost:3000/formulario-pago?usuario={id_usuario}&total={total}"

    return Response({'url_pago': url_pago})

@api_view(['POST'])
def respuesta_pago(request):
    try:
        id_usuario = request.data.get('id_usuario')
        monto = request.data.get('monto')
        estado = request.data.get('estado')

        if estado != 'ACEPTADO':
            return Response({'error': 'Pago rechazado'}, status=status.HTTP_400_BAD_REQUEST)

        carrito = Carrito.objects.filter(usuario__id_user=id_usuario)
        if not carrito.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear Pedido
        pedido = Pedido.objects.create(
            usuario_id=id_usuario,
            fecha_pedido=timezone.now(),
            fecha_entrega_stm=timezone.now() + timezone.timedelta(days=3),
            total_pedido=monto,
            estado_id=1,
            tipo_despacho_id=100,
            tipo_comprobante_id=1
        )

        # Crear Pago asociado
        pago = Pago.objects.create(
            pedido=pedido,
            medio_pago_id=10,
            estado_pago=True,
            fecha_pago=timezone.now(),
            monto_pago=monto
        )

        # Vaciar carrito
        carrito.delete()

        return Response({
            'mensaje': f'Pedido #{pedido.id_pedido} y pago #{pago.id_pago} registrados con éxito.'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)