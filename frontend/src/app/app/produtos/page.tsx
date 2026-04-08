'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  costPrice: string;
  suggestedPrice: string | null;
  stock: number;
  lowStockAlert: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    costPrice: '',
    suggestedPrice: '',
    stock: '',
    lowStockAlert: '5',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productsApi.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        costPrice: parseFloat(formData.costPrice),
        suggestedPrice: formData.suggestedPrice ? parseFloat(formData.suggestedPrice) : undefined,
        stock: parseInt(formData.stock),
        lowStockAlert: parseInt(formData.lowStockAlert),
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, data);
      } else {
        await productsApi.create(data);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      costPrice: product.costPrice,
      suggestedPrice: product.suggestedPrice || '',
      stock: product.stock.toString(),
      lowStockAlert: product.lowStockAlert.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productsApi.delete(id);
        loadProducts();
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      costPrice: '',
      suggestedPrice: '',
      stock: '',
      lowStockAlert: '5',
    });
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium"
        >
          <span className="text-lg">+</span>
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isLowStock = product.stock < product.lowStockAlert;
            return (
              <div
                key={product.id}
                className={`bg-gray-800/50 rounded-2xl border p-6 transition hover:bg-gray-800/70 ${
                  isLowStock 
                    ? 'border-yellow-500/30' 
                    : 'border-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                    {isLowStock && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full mt-1">
                        ⚠️ Estoque baixo
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Custo</span>
                    <span className="text-white font-medium">{formatCurrency(product.costPrice)}</span>
                  </div>
                  {product.suggestedPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Preço sugerido</span>
                      <span className="text-green-400 font-medium">{formatCurrency(product.suggestedPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                    <span className="text-gray-400 text-sm">Estoque</span>
                    <span className={`font-bold text-lg ${
                      isLowStock ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-12 text-center">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-400 mb-6">Comece adicionando seus primeiros produtos</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium"
          >
            <span className="text-lg">+</span>
            <span>Cadastrar Produto</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-bold mb-6">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nome do produto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                  placeholder="Camisa Polo Azul"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Preço de custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="25.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Preço sugerido (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.suggestedPrice}
                    onChange={(e) => setFormData({ ...formData, suggestedPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="49.90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Estoque</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Alertar se &lt;</label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
