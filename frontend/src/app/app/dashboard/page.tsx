'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/lib/api';

interface DashboardData {
  monthlyRevenue: number;
  monthlyProfit: number;
  totalOrders: number;
  lowStockProducts: number;
  recentOrders: any[];
  recentAlerts: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await reportsApi.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const profit = data?.monthlyProfit || 0;
  const profitPercentage = data?.monthlyRevenue 
    ? ((profit / data.monthlyRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
              Este mês
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Faturamento</p>
          <p className="text-white text-3xl font-bold">{formatCurrency(data?.monthlyRevenue || 0)}</p>
        </div>

        {/* Profit Card */}
        <div className={`bg-gradient-to-br rounded-2xl p-6 border ${
          profit >= 0 
            ? 'from-gray-800 to-gray-900 border-green-500/20' 
            : 'from-gray-800 to-gray-900 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              <span className="text-2xl">{profit >= 0 ? '📈' : '📉'}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              profit >= 0 
                ? 'text-green-400 bg-green-500/10' 
                : 'text-red-400 bg-red-500/10'
            }`}>
              {profitPercentage}% da venda
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Lucro Líquido</p>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Pedidos</p>
          <p className="text-white text-3xl font-bold">{data?.totalOrders || 0}</p>
        </div>

        {/* Alerts Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              (data?.lowStockProducts || 0) > 0 ? 'bg-yellow-500/10' : 'bg-gray-500/10'
            }`}>
              <span className="text-2xl">⚠️</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (data?.lowStockProducts || 0) > 0
                ? 'text-yellow-400 bg-yellow-500/10'
                : 'text-gray-400 bg-gray-500/10'
            }`}>
              {(data?.lowStockProducts || 0) > 0 ? 'Atenção' : 'Ok'}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Estoque Baixo</p>
          <p className={`text-3xl font-bold ${
            (data?.lowStockProducts || 0) > 0 ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            {data?.lowStockProducts || 0}
          </p>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-white font-semibold">Pedidos Recentes</h3>
            <button onClick={() => window.location.href = '/app/pedidos'} className="text-blue-400 hover:text-blue-300 text-sm">
              Ver todos →
            </button>
          </div>
          
          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-700/50">
              {data.recentOrders.map((order: any) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/20 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.platform === 'ONLINE' 
                        ? 'bg-green-500/10' 
                        : 'bg-purple-500/10'
                    }`}>
                      <span className="text-lg">
                        {order.platform === 'ONLINE' ? '🌐' : '🏪'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{order.product.name}</p>
                      <p className="text-gray-500 text-sm">
                        {order.platform === 'ONLINE' ? 'Online' : 'Estabelecimento'}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    Number(order.profit) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Number(order.profit) >= 0 ? '+' : ''}{formatCurrency(Number(order.profit))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-gray-400 mb-2">Nenhum pedido ainda</p>
              <button onClick={() => window.location.href = '/app/pedidos'} className="text-blue-400 hover:text-blue-300 text-sm">
                Registrar primeiro pedido
              </button>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-white font-semibold">Alertas</h3>
            <button onClick={() => window.location.href = '/app/alertas'} className="text-blue-400 hover:text-blue-300 text-sm">
              Ver todos →
            </button>
          </div>
          
          {data?.recentAlerts && data.recentAlerts.length > 0 ? (
            <div className="divide-y divide-gray-700/50">
              {data.recentAlerts.map((alert: any) => (
                <div 
                  key={alert.id} 
                  className={`px-6 py-4 flex items-center gap-4 ${
                    alert.type === 'LOW_STOCK' 
                      ? 'bg-yellow-500/5' 
                      : 'bg-red-500/5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    alert.type === 'LOW_STOCK' 
                      ? 'bg-yellow-500/10' 
                      : 'bg-red-500/10'
                  }`}>
                    <span className="text-lg">
                      {alert.type === 'LOW_STOCK' ? '⚠️' : '❌'}
                    </span>
                  </div>
                  <p className="text-gray-300 flex-1">{alert.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-gray-400 mb-2">Tudo certo!</p>
              <p className="text-gray-500 text-sm">Nenhum alerta no momento</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => window.location.href = '/app/produtos'}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl transition border border-gray-700/50"
          >
            <span>📦</span>
            <span>Cadastrar Produto</span>
          </button>
          <button
            onClick={() => window.location.href = '/app/pedidos'}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl transition border border-gray-700/50"
          >
            <span>🛒</span>
            <span>Registrar Venda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
