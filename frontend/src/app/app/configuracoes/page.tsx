'use client';

import { useAuthStore } from '@/hooks/useAuth';

export default function ConfiguracoesPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl space-y-6">
      {/* Account Card */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-white text-lg font-semibold mb-6">Sua Conta</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-lg font-semibold">Plano Atual</h2>
            <p className="text-gray-400 text-sm mt-1">Recursos disponíveis</p>
          </div>
          <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
            Grátis
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <p className="text-2xl font-bold text-white">50</p>
            <p className="text-gray-400 text-sm">Produtos</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <p className="text-2xl font-bold text-white">100</p>
            <p className="text-gray-400 text-sm">Pedidos/mês</p>
          </div>
        </div>

        <button className="w-full mt-6 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium">
          Fazer upgrade para Pro →
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
        <h2 className="text-red-400 text-lg font-semibold mb-2">Zona de Perigo</h2>
        <p className="text-gray-400 text-sm mb-4">
          Estas ações são irreversíveis. Tenha cuidado.
        </p>
        <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm">
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}
