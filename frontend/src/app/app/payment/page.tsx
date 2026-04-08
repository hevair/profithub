'use client';

import { useEffect, useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  maxProducts: number;
  maxOrders: number;
  features: string;
  stripePriceId: string;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlanInfo();
  }, []);

  const loadPlanInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // Find Pro plan
      if (data.limits) {
        const proPlan = Object.values(data.limits).find((p: any) => p.name === 'PRO') as Plan | undefined;
        if (proPlan) {
          setSelectedPlan({
            id: 'pro',
            name: 'PRO',
            price: 29,
            maxProducts: 999999,
            maxOrders: 999999,
            features: 'Produtos ilimitados, Pedidos ilimitados, Relatórios avançados, Suporte prioritário',
            stripePriceId: 'price_pro_monthly',
          });
        }
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          priceId: selectedPlan.stripePriceId,
        }),
      });

      const data = await res.json();
      
      // Simulação de pagamento - em produção redirecionaria para Stripe
      if (data.url) {
        // Mostrar modal de simulação
        const confirmed = confirm(
          '💳 SIMULAÇÃO DE PAGAMENTO\n\n' +
          `Plano: ${selectedPlan.name}\n` +
          `Valor: R$ ${selectedPlan.price},00/mês\n\n` +
          'Clique OK para simular pagamento aprovado.'
        );

        if (confirmed) {
          // Simular sucesso
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: data.sessionId,
              status: 'paid',
            }),
          });
          
          alert('🎉 Pagamento aprovado! Você agora é PRO!');
          window.location.href = '/app/dashboard';
        }
      }
    } catch (err) {
      setError('Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Plano não disponível</h1>
        <p className="text-gray-400">Entre em contato com o suporte.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upgrade para Pro</h1>
        <p className="text-gray-400">Desbloqueie todo o potencial do ProfitHub</p>
      </div>

      {/* Plan Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-purple-500/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">💎 {selectedPlan.name}</h2>
            <p className="text-gray-400">Plano mensal</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">R$ {selectedPlan.price}</p>
            <p className="text-gray-400">por mês</p>
          </div>
        </div>

        <div className="border-t border-purple-500/30 pt-6 mb-6">
          <h3 className="text-white font-semibold mb-3">O que você ganha:</h3>
          <ul className="space-y-2">
            {selectedPlan.features.split(',').map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span>
                {feature.trim()}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Payment Form Simulation */}
        <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">💳 Dados de pagamento</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Número do cartão</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                disabled={processing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Validade</label>
                <input
                  type="text"
                  placeholder="12/28"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  disabled={processing}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  disabled={processing}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processando...
            </span>
          ) : (
            `Assinar por R$ ${selectedPlan.price}/mês`
          )}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          🔒 Pagamento seguro via Stripe
        </p>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
        <p className="text-gray-400 text-sm text-center">
          💡 Na versão de produção, você será redirecionado para o Stripe Checkout seguro.
          <br />
          Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}
