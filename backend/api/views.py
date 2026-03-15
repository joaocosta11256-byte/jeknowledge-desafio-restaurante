from rest_framework import viewsets
from .models import MenuItem, Order
from .serializers import MenuItemSerializer, OrderSerializer

# 1. View para o Menu
class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    # ReadOnlyModelViewSet: Só permite ler (GET). 
    # Os clientes não podem apagar ou alterar o menu pela API!
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

# 2. View para os Pedidos
class OrderViewSet(viewsets.ModelViewSet):
    # ModelViewSet: Permite tudo (GET, POST, PATCH, DELETE)
    # Ordenamos por data de criação (os mais recentes primeiro)
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer