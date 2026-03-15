from rest_framework import serializers
from .models import MenuItem, Order, OrderLine

# 1. Serializer para o Menu (Catálogo de pratos)
class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__' # Devolve todos os campos (id, name, category, etc.)


# 2. Serializer para as Linhas do Pedido (Os pratos de cada mesa)
class OrderLineSerializer(serializers.ModelSerializer):
    # Vamos pedir ao Django para ir buscar o nome e os ingredientes do prato diretamente!
    dish_name = serializers.CharField(source='menu_item.name', read_only=True)
    ingredients = serializers.CharField(source='menu_item.ingredients', read_only=True)

    class Meta:
        model = OrderLine
        fields = ['menu_item', 'dish_name', 'quantity', 'ingredients']


# 3. Serializer para o Pedido Principal (A fatura da mesa)
class OrderSerializer(serializers.ModelSerializer):
    # 'lines' é o related_name que definimos no models.py. 
    # Isto aninha as linhas dentro do pedido!
    lines = OrderLineSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'table_number', 'status', 'created_at', 'lines']

    # Como estamos a receber os pratos (lines) e a mesa (order) ao mesmo tempo,
    # temos de ensinar o Django a guardar tudo junto quando o cliente clica em "Submeter".
    def create(self, validated_data):
        lines_data = validated_data.pop('lines')
        # Cria o Pedido principal (Order)
        order = Order.objects.create(**validated_data)
        # Cria as linhas (OrderLine) e associa-as ao Pedido
        for line_data in lines_data:
            OrderLine.objects.create(order=order, **line_data)
        return order