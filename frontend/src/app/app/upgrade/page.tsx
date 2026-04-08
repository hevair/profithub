'use client';

import { useEffect, useState } from 'react';

interface PlanInfo {
  plan: string;
  planName: string;
  price: number;
  features: string[];
  usage: {
    products: { current: number; limit: number; unlimited: boolean };
    orders: { current: number; limit: number; unlimited: boolean };
    alerts: { current: number; limit: number; unlimited: boolean };
  };
}

export default function UpgradePage() {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
      setPlanInfo(data);
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/app/payment';
  };

  const handleDowngrade = async () => {
    if (!confirm('Confirmar downgrade para Grátis?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/downgrade`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Plano downgrade para Grátis');
      loadPlanInfo();
    } catch (err) {
      alert('Erro ao fazer downgrade');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const isPro = planInfo?.plan === 'PRO';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Current Plan Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Plano {planInfo?.planName}</h1>
        <p className="text-gray-400">
          {isPro ? 'Aproveite todos os recursos ilimitados!' : 'Faça upgrade para desbloquear tudo'}
        </p>
      </div>

      {/* Usage Stats */}
      {!isPro && (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-white font-semibold mb-4">Uso atual do plano Grátis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Produtos</span>
                <span className="text-white font-medium">
                  {planInfo?.usage.products.current} / {planInfo?.usage.products.limit}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${(planInfo?.usage.products.current || 0) >= 40 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, ((planInfo?.usage.products.current || 0) / (planInfo?.usage.products.limit || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Pedidos (mês)</span>
                <span className="text-white font-medium">
                  {planInfo?.usage.orders.current} / {planInfo?.usage.orders.limit}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${(planInfo?.usage.orders.current || 0) >= 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, ((planInfo?.usage.orders.current || 0) / (planInfo?.usage.orders.limit || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Alertas (mês)</span>
                <span className="text-white font-medium">
                  {planInfo?.usage.alerts.current} / {planInfo?.usage.alerts.limit}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${(planInfo?.usage.alerts.current || 0) >= 8 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, ((planInfo?.usage.alerts.current || 0) / (planInfo?.usage.alerts.limit || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`bg-gray-800/50 rounded-2xl border p-6 ${isPro ? 'border-gray-700/50 opacity-60' : 'border-blue-500/50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Grátis</h3>
            <span className="text-2xl font-bold text-white">
              R$ 0<span className="text-sm font-normal text-gray-400">/mês</span>
            </span>
          </div>
          
          <ul className="space-y-3 mb-6">
            {['Produtos', 'Pedidos', 'Alertas'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span>
                {item} limitados
              </li>
            ))}
            <li className="flex items-center gap-2 text-gray-500">
              <span className="text-gray-500">✓</span>
              Dashboard básico
            </li>
          </ul>

          {isPro ? (
            <button
              onClick={handleDowngrade}
              className="w-full py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition"
            >
              Fazer Downgrade
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-gray-700 text-gray-400 rounded-xl cursor-not-allowed"
            >
              Plano Atual
            </button>
          )}
        </div>

        {/* Pro Plan */}
        <div className={`rounded-2xl border p-6 relative overflow-hidden ${
          isPro 
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50' 
            : 'bg-gray-800/50 border-gray-700/50'
        }`}>
          {isPro && (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              ATUAL
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Pro</h3>
            <span className="text-2xl font-bold text-white">
              R$ 29<span className="text-sm font-normal text-gray-400">/mês</span>
            </span>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              'Produtos ilimitados',
              'Pedidos ilimitados',
              'Alertas ilimitados',
              'Relatórios avançados',
              'Suporte prioritário',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-300">
                <span className="text-yellow-400">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {isPro ? (
            <button
              disabled
              className="w-full py-3 bg-green-500/20 text-green-400 rounded-xl cursor-not-allowed border border-green-500/30"
            >
              Plano Atual ✓
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
            >
              Fazer Upgrade →
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-800/30 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">
          💡 Na versão completa, a integração seria com Stripe/PicPay para pagamentos automáticos
        </p>
      </div>
    </div>
  );
}
