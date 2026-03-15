import { useState, useEffect } from 'react';

export default function ClientView() {
  const [menu, setMenu] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [feedback, setFeedback] = useState('');

  const categoriasFixas = ['Entradas', 'Sopas', 'Carne', 'Peixe', 'Sobremesa'];

  useEffect(() => {
    fetch('http://localhost:8000/api/menu/')
      .then((resposta) => resposta.json())
      .then((dados) => setMenu(dados))
      .catch((erro) => console.error("Erro a carregar menu:", erro));
  }, []);

  const adicionarAoPedido = (pratoId, nome, quantidade) => {
    if (quantidade <= 0) return;
    
    setCart((carrinhoAtual) => {
      const pratoExiste = carrinhoAtual.find(item => item.menu_item === pratoId);
      if (pratoExiste) {
        return carrinhoAtual.map(item => 
          item.menu_item === pratoId 
            ? { ...item, quantity: item.quantity + quantidade } 
            : item
        );
      }
      return [...carrinhoAtual, { menu_item: pratoId, nome: nome, quantity: quantidade }];
    });
  };

  const submeterPedido = async () => {
    const numeroMesa = parseInt(tableNumber);
    if (!tableNumber||isNaN(numeroMesa) || numeroMesa <= 0) {
      alert("Por favor, selecione o número da mesa antes de pedir.");
      return;
    }
    if (cart.length === 0) {
      alert("O seu pedido está vazio.");
      return;
    }

    const payload = {
      table_number: numeroMesa,
      lines: cart.map(item => ({
        menu_item: item.menu_item,
        quantity: item.quantity
      }))
    };

    try {
      const resposta = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resposta.ok) {
        setFeedback("Pedido enviado com sucesso para a cozinha!");
        setCart([]);
        setTableNumber('');
        setTimeout(() => setFeedback(''), 5000);
      }
    } catch (erro) {
      console.error("Erro ao enviar pedido:", erro);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#333', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* Lado Esquerdo: O Menu */}
      <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
        <h1 style={{ color: '#111', borderBottom: '3px solid #cbd5e1', paddingBottom: '10px', marginBottom: '30px' }}>
          Menu do Restaurante
        </h1>
        
        {categoriasFixas.map(categoria => (
          <div key={categoria} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginTop: '0' }}>
              {categoria}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {menu.filter(prato => prato.category === categoria).map(prato => (
                <div key={prato.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    
                    {/* Info do Prato */}
                    <div style={{ flex: '1 1 200px' }}>
                      <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>{prato.name}</h3>
                      <p style={{ margin: '0', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{prato.description}</p>
                    </div>
                    
                    {/* Formulário de Adicionar */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        adicionarAoPedido(prato.id, prato.name, parseInt(e.target.qtd.value));
                        e.target.qtd.value = 1;
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <input 
                        type="number" 
                        name="qtd" 
                        min="1" 
                        defaultValue="1" 
                        style={{ padding: '10px', width: '60px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '16px', textAlign: 'center' }} 
                      />
                      <button 
                        type="submit"
                        style={{ padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        + Adicionar
                      </button>
                    </form>

                  </div>
                </div>
              ))}
            </div>
            
            {menu.filter(prato => prato.category === categoria).length === 0 && (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum prato disponível nesta categoria.</p>
            )}
          </div>
        ))}
      </div>

      {/* Lado Direito: O Resumo do Pedido (Sticky) */}
      <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          position: 'sticky', 
          top: '30px' 
        }}>
          <h2 style={{ color: '#0f172a', marginTop: '0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
            O Seu Pedido
          </h2>
          
          <div style={{ marginBottom: '25px', marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>
              Número da Mesa:
            </label>
            <input 
              type="number" 
              value={tableNumber} 
              onChange={(e) => setTableNumber(e.target.value)} 
              min="1"
              placeholder="Ex: 5"
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ minHeight: '100px' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '30px' }}>O seu pedido está vazio.</p>
            ) : (
              <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
                {cart.map((item, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                    <span><strong>{item.quantity}x</strong> {item.nome}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <button 
              onClick={submeterPedido}
              style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '25px', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              Confirmar e Enviar Pedido
            </button>
          )}

          {feedback && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
              {feedback}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}