'use client';

import { useEffect, useState } from 'react';
import { alertsApi } from '@/lib/api';

interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'LOW_MARGIN' | 'NO_STOCK';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await alertsApi.getAll();
      setAlerts(res.data);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await alertsApi.markAsRead(id);
      setAlerts(alerts.map(a => 
        a.id === id ? { ...a, isRead: true } : a
      ));
    } catch (err) {
      console.error('Erro ao marcar alerta:', err);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await alertsApi.delete(id);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao excluir alerta:', err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return { icon: '⚠️', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
      case 'LOW_MARGIN':
        return { icon: '📉', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'NO_STOCK':
        return { icon: '❌', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      default:
        return { icon: '🔔', bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const readAlerts = alerts.filter(a => a.isRead);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <p className="text-gray-400 text-sm mb-1">Total de Alertas</p>
          <p className="text-white text-3xl font-bold">{alerts.length}</p>
        </div>
        <div className="bg-yellow-500/5 rounded-2xl border border-yellow-500/20 p-6">
          <p className="text-yellow-400 text-sm mb-1">Não Lidos</p>
          <p className="text-yellow-400 text-3xl font-bold">{unreadAlerts.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
          <p className="text-gray-400 text-sm mb-1">Lidos</p>
          <p className="text-gray-400 text-3xl font-bold">{readAlerts.length}</p>
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="space-y-8">
          {unreadAlerts.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Novos ({unreadAlerts.length})
              </h2>
              <div className="space-y-3">
                {unreadAlerts.map((alert) => {
                  const config = getAlertConfig(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`${config.bg} border ${config.border} rounded-xl p-5 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900/50 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{config.icon}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{alert.message}</p>
                          <p className="text-gray-400 text-sm mt-1">{formatDate(alert.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
                        >
                          Marcar lido
                        </button>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {readAlerts.length > 0 && (
            <div>
              <h2 className="text-gray-400 font-semibold mb-4">Lidos ({readAlerts.length})</h2>
              <div className="space-y-3">
                {readAlerts.map((alert) => {
                  const config = getAlertConfig(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`${config.bg} border ${config.border} rounded-xl p-5 flex items-center justify-between opacity-60`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900/50 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{config.icon}</span>
                        </div>
                        <div>
                          <p className="text-gray-300">{alert.message}</p>
                          <p className="text-gray-500 text-sm mt-1">{formatDate(alert.createdAt)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-12 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✨</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Tudo certo!</h3>
          <p className="text-gray-400">Nenhum alerta no momento. Continue vendendo!</p>
        </div>
      )}
    </div>
  );
}
