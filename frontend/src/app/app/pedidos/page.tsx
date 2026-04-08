'use client';

import { useEffect, useState } from 'react';
import { ordersApi, productsApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  costPrice: string;
}

interface Order {
  id: string;
  product: { id: string; name: string };
  platform: 'ONLINE' | 'ESTABLISHMENT';
  salePrice: string;
  shippingCost: string;
  fee: string;
  profit: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    platform: 'ONLINE' as 'ONLINE' | 'ESTABLISHMENT',
    salePrice: '',
    fee: '',
    shippingCost: '',
  });
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.productId && formData.salePrice) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const cost = parseFloat(product.costPrice) || 0;
        const sale = parseFloat(formData.salePrice) || 0;
        const fee = parseFloat(formData.fee) || 0;
        const shipping = parseFloat(formData.shippingCost) || 0;
        setCalculatedProfit(sale - cost - fee - shipping);
      }
    } else {
      setCalculatedProfit(null);
    }
  }, [formData.productId, formData.salePrice, formData.fee, formData.shippingCost, products]);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        ordersApi.getAll(),
        productsApi.getAll(),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ordersApi.create({
        productId: formData.productId,
        platform: formData.platform,
        salePrice: parseFloat(formData.salePrice),
        fee: parseFloat(formData.fee) || 0,
        shippingCost: parseFloat(formData.shippingCost) || 0,
      });

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao registrar pedido');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      platform: 'ONLINE',
      salePrice: '',
      fee: '',
      shippingCost: '',
    });
    setCalculatedProfit(null);
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalProfit = orders.reduce((sum, o) => sum + parseFloat(o.profit), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <p className="text-gray-400 text-sm mb-1">Total de Pedidos</p>
          <p className="text-white text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <p className="text-gray-400 text-sm mb-1">Lucro Total</p>
          <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 flex items-center justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium"
          >
            <span className="text-xl">+</span>
            <span>Novo Pedido</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plataforma</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Venda</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/20 transition">
                  <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-white font-medium">{order.product.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      order.platform === 'ONLINE'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      <span>{order.platform === 'ONLINE' ? '🌐' : '🏪'}</span>
                      {order.platform === 'ONLINE' ? 'Online' : 'Estabelecimento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300">{formatCurrency(order.salePrice)}</td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    parseFloat(order.profit) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(order.profit) >= 0 ? '+' : ''}{formatCurrency(order.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-12 text-center">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Nenhum pedido registrado</h3>
          <p className="text-gray-400 mb-6">Registre suas primeiras vendas para acompanhar seu lucro</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium"
          >
            <span className="text-lg">+</span>
            <span>Registrar Venda</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-bold mb-6">Novo Pedido</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Produto</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Plataforma</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'ONLINE' })}
                    className={`px-4 py-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                      formData.platform === 'ONLINE'
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>🌐</span>
                    <span>Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'ESTABLISHMENT' })}
                    className={`px-4 py-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                      formData.platform === 'ESTABLISHMENT'
                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>🏪</span>
                    <span>Estabelecimento</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Valor da venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                  placeholder="59.90"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Taxa (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="8.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Frete (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="8.50"
                  />
                </div>
              </div>

              {calculatedProfit !== null && (
                <div className={`p-4 rounded-xl ${
                  calculatedProfit >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <p className="text-gray-400 text-sm mb-1">Lucro calculado:</p>
                  <p className={`text-2xl font-bold ${
                    calculatedProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculatedProfit >= 0 ? '+' : ''}{formatCurrency(calculatedProfit)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
