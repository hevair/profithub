'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuth';

const navItems = [
  { href: '/app/dashboard', label: 'Resumo', icon: '📊' },
  { href: '/app/produtos', label: 'Produtos', icon: '📦' },
  { href: '/app/pedidos', label: 'Pedidos', icon: '🛒' },
  { href: '/app/alertas', label: 'Alertas', icon: '🔔' },
  { href: '/app/upgrade', label: 'Plano', icon: '💎' },
];

function Sidebar({ isOpen, onToggle, currentPath, user, onNavigate, onLogout }: { 
  isOpen: boolean; 
  onToggle: () => void;
  currentPath: string;
  user: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 fixed h-full z-50`}>
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {isOpen && (
            <span className="text-white font-bold text-xl">ProfitHub</span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <span className="text-xl">{isOpen ? '◀' : '▶'}</span>
          {isOpen && <span className="font-medium">Recolher</span>}
        </button>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button
            onClick={onLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all text-sm"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { init, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('/app/dashboard');
  const [planInfo, setPlanInfo] = useState<{plan: string; planName: string} | null>(null);

  useEffect(() => {
    init();
    setMounted(true);
    setCurrentPath(window.location.pathname);
    loadPlanInfo();
  }, [init]);

  const loadPlanInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlanInfo({ plan: data.plan, planName: data.planName });
      }
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
    }
  };

  const handleNavigate = (href: string) => {
    setCurrentPath(href);
    window.location.href = href;
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    return navItems.find(n => n.href === currentPath)?.label || 'Dashboard';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={currentPath}
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold">{getPageTitle()}</h2>
              <p className="text-gray-500 text-sm">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/app/upgrade'}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                planInfo?.plan === 'PRO'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}
            >
              💎 {planInfo?.planName || 'Grátis'}
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
