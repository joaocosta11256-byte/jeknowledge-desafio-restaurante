from django.db import models

class MenuItem(models.Model):
    # as 5 categorias do menu
    CATEGORY_CHOICES = [
        ('Entradas', 'Entradas'),
        ('Sopas', 'Sopas'),
        ('Carne', 'Carne'),
        ('Peixe', 'Peixe'),
        ('Sobremesa', 'Sobremesa'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    ingredients = models.TextField()

    def __str__(self):
        return self.name


class Order(models.Model):
    # as colunas do dashboard da cozinha
    STATUS_CHOICES = [
        ('Order Preview', 'Order Preview'),
        ('Preparing', 'Preparing'),
        ('Cooling Down', 'Cooling Down'),
        ('Ready to Serve', 'Ready to Serve'),
        ('Concluded', 'Concluded'),
    ]

    table_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Order Preview')
    created_at = models.DateTimeField(auto_now_add=True) # Guarda a hora automaticamente

    def __str__(self):
        return f"Pedido #{self.id} - Mesa {self.table_number} ({self.status})"


class OrderLine(models.Model):
    # tabela para "ligar" o Pedido (Order) ao Prato (MenuItem)
    order = models.ForeignKey(Order, related_name='lines', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (Pedido #{self.order.id})"