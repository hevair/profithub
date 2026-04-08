'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ProfitHub</h1>
          <p className="text-gray-400">Painel do Administrador</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
          <h2 className="text-xl font-bold text-white mb-6">Login Admin</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                placeholder="admin@profithub.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-sm text-center">
              Credenciais padrão:<br />
              <code className="text-gray-300">admin@profithub.com</code> / <code className="text-gray-300">admin123</code>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-gray-500 hover:text-white text-sm">
            ← Voltar para home
          </a>
        </div>
      </div>
    </div>
  );
}
