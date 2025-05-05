from django.urls import path
from .views import *

urlpatterns = [
    path('items/', ItemListCreate.as_view(), name='item-list-create'),
    path('login/', login_view),
]