import { useState, useEffect } from 'react';

export default function KitchenView() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const colunas = ['Order Preview', 'Preparing', 'Cooling Down', 'Ready to Serve', 'Concluded'];

  const carregarPedidos = async () => {
    try {
      const resposta = await fetch('http://localhost:8000/api/orders/');
      if (resposta.ok) {
        const dados = await resposta.json();
        setOrders(dados);
      }
    } catch (erro) {
      console.error("Erro ao carregar pedidos:", erro);
    }
  };

  useEffect(() => {
    carregarPedidos();
    const intervalo = setInterval(() => {
      carregarPedidos();
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  // Função central para atualizar a fase (usada tanto pelo botão como pelo drag-and-drop)
  const atualizarFasePedido = async (pedidoId, novaFase) => {
    try {
      const resposta = await fetch(`http://localhost:8000/api/orders/${pedidoId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novaFase })
      });

      if (resposta.ok) {
        setOrders(orders.map(o => o.id === parseInt(pedidoId) ? { ...o, status: novaFase } : o));
      }
    } catch (erro) {
      console.error("Erro ao atualizar fase:", erro);
    }
  };

  // Lógica do botão "Avançar"
  const avancarFaseBotao = (pedidoId, faseAtual, e) => {
    e.stopPropagation(); // Impede que o modal de ingredientes abra ao clicar no botão
    const indexAtual = colunas.indexOf(faseAtual);
    if (indexAtual >= colunas.length - 1) return;
    
    const novaFase = colunas[indexAtual + 1];
    atualizarFasePedido(pedidoId, novaFase);
  };

  const obterTextoBotao = (faseAtual) => {
    switch(faseAtual) {
      case 'Order Preview': return 'Começar a Preparar';
      case 'Preparing': return 'Avançar →';
      case 'Cooling Down': return 'Avançar →';
      case 'Ready to Serve': return 'Concluir Pedido';
      default: return '';
    }
  };

  const formatarHora = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- Funções de DRAG AND DROP ---
  const handleDragStart = (e, pedidoId) => {
    e.dataTransfer.setData('pedidoId', pedidoId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e, novaFase) => {
    e.preventDefault();
    const pedidoId = e.dataTransfer.getData('pedidoId');
    if (pedidoId) {
      atualizarFasePedido(pedidoId, novaFase);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#333' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#111' }}>Dashboard de Cozinha</h1>
        <button 
          onClick={carregarPedidos}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ↻ Atualizar Pedidos
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px', minHeight: '70vh' }}>
        {colunas.map(coluna => (
          <div 
            key={coluna} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, coluna)}
            style={{ flex: '1', minWidth: '260px', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column' }}
          >
            <h3 style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '10px', marginTop: '0', color: '#1e293b' }}>
              {coluna}
            </h3>
            
            {orders.filter(o => o.status === coluna).map(pedido => (
              <div 
                key={pedido.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, pedido.id)}
                onClick={() => setSelectedOrder(pedido)} 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  marginBottom: '15px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'grab', 
                  borderLeft: '4px solid #3b82f6',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                title="Clica no fundo para ver ingredientes, ou arrasta o cartão"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '18px', color: '#0f172a' }}>Mesa {pedido.table_number}</strong>
                  <span style={{ color: '#64748b', fontWeight: 'bold' }}>{formatarHora(pedido.created_at)}</span>
                </div>
                
                <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0', color: '#334155', flexGrow: 1 }}>
                  {pedido.lines.map((linha, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>
                      <strong>{linha.quantity}x</strong> {linha.dish_name}
                    </li>
                  ))}
                </ul>
                
                {/* O Botão de Avançar regressa, trabalhando em harmonia com o Drag-and-Drop */}
                {coluna !== 'Concluded' && (
                  <button 
                    onClick={(e) => avancarFaseBotao(pedido.id, coluna, e)}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      fontSize: '14px', 
                      backgroundColor: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background 0.2s',
                      marginTop: '10px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    {obterTextoBotao(coluna)}
                  </button>
                )}

                <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: '10px 0 0 0' }}>
                  ≡ Arrasta para mover
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal de Ingredientes */}
      {selectedOrder && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
          onClick={() => setSelectedOrder(null)} 
        >
          <div 
            style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%', color: '#333' }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 style={{ marginTop: '0', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
              Ingredientes - Mesa {selectedOrder.table_number}
            </h2>
            <ul style={{ lineHeight: '1.8', color: '#334155', paddingLeft: '20px' }}>
              {selectedOrder.lines.map((linha, idx) => (
                <li key={idx}>
                  <strong style={{ color: '#0f172a' }}>{linha.dish_name}:</strong> {linha.ingredients}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ marginTop: '20px', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}