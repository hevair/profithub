'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalTenants: number;
  proTenants: number;
  freeTenants: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  monthlyRevenue: number;
  proConversion: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
  createdAt: string;
  usersCount: number;
  productsCount: number;
  ordersCount: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  maxProducts: number;
  maxOrders: number;
  maxAlerts: number;
  features: string;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard' || activeTab === 'users') {
        const res = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders() });
        const data = await res.json();
        setStats(data);
      }
      
      if (activeTab === 'users') {
        const res = await fetch(`${API_URL}/admin/tenants`, { headers: getHeaders() });
        const data = await res.json();
        setTenants(data.data || []);
      }

      if (activeTab === 'plans') {
        const res = await fetch(`${API_URL}/admin/plans`, { headers: getHeaders() });
        const data = await res.json();
        setPlans(data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleChangePlan = async (tenantId: string, newPlan: string) => {
    if (!confirm(`Alterar plano para ${newPlan}?`)) return;
    
    try {
      await fetch(`${API_URL}/admin/tenants/${tenantId}/plan`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ plan: newPlan }),
      });
      alert('Plano atualizado!');
      loadData();
    } catch (err) {
      alert('Erro ao atualizar plano');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('Tem certeza? Isso excluirá TODOS os dados!')) return;
    
    try {
      await fetch(`${API_URL}/admin/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      alert('Usuário excluído!');
      loadData();
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  const handleSavePlan = async (plan: Plan) => {
    try {
      await fetch(`${API_URL}/admin/plans/${plan.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(plan),
      });
      alert('Plano atualizado!');
      loadData();
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Gerencie planos, usuários e configurações</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            🚪 Sair
          </button>
        </div>
        
        {/* Tabs */}
        <div className="px-8 flex gap-6 border-t border-gray-800">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'users', label: '👥 Usuários' },
            { id: 'plans', label: '💎 Planos' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <p className="text-gray-400 text-sm mb-1">Total de Lojas</p>
                <p className="text-4xl font-bold text-white">{stats.totalTenants}</p>
              </div>
              <div className="bg-purple-500/10 rounded-2xl border border-purple-500/20 p-6">
                <p className="text-purple-400 text-sm mb-1">Clientes Pro</p>
                <p className="text-4xl font-bold text-purple-400">{stats.proTenants}</p>
              </div>
              <div className="bg-green-500/10 rounded-2xl border border-green-500/20 p-6">
                <p className="text-green-400 text-sm mb-1">Receita Mensal</p>
                <p className="text-4xl font-bold text-green-400">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
              <div className="bg-blue-500/10 rounded-2xl border border-blue-500/20 p-6">
                <p className="text-blue-400 text-sm mb-1">Taxa Conversão</p>
                <p className="text-4xl font-bold text-blue-400">{stats.proConversion}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <p className="text-gray-400 text-sm mb-1">Total de Usuários</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <p className="text-gray-400 text-sm mb-1">Total de Produtos</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <p className="text-gray-400 text-sm mb-1">Total de Pedidos</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Gerenciar Usuários</h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Loja</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Plano</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Produtos</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Pedidos</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Desde</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {tenants.map(tenant => (
                      <tr key={tenant.id} className="hover:bg-gray-700/20">
                        <td className="px-6 py-4 text-white font-medium">{tenant.name}</td>
                        <td className="px-6 py-4">
                          <select
                            value={tenant.plan}
                            onChange={(e) => handleChangePlan(tenant.id, e.target.value)}
                            className="bg-gray-700 text-white text-sm rounded px-2 py-1"
                          >
                            <option value="FREE">FREE</option>
                            <option value="PRO">PRO</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{tenant.productsCount}</td>
                        <td className="px-6 py-4 text-gray-400">{tenant.ordersCount}</td>
                        <td className="px-6 py-4 text-gray-400">{formatDate(tenant.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteTenant(tenant.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tenants.length === 0 && (
                  <div className="p-12 text-center text-gray-400">Nenhum usuário encontrado</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Configurar Planos</h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, name: e.target.value } : p))}
                        className="text-xl font-bold text-white bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none"
                      />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Preço (R$/mês)</label>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, price: Number(e.target.value) } : p))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Produtos</label>
                          <input
                            type="number"
                            value={plan.maxProducts}
                            onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxProducts: Number(e.target.value) } : p))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Pedidos</label>
                          <input
                            type="number"
                            value={plan.maxOrders}
                            onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxOrders: Number(e.target.value) } : p))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Alertas</label>
                          <input
                            type="number"
                            value={plan.maxAlerts}
                            onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxAlerts: Number(e.target.value) } : p))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Features</label>
                        <input
                          type="text"
                          value={plan.features}
                          onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, features: e.target.value } : p))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleSavePlan(plan)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setPlans(plans.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                      >
                        {plan.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
