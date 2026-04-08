'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authApi.register({ email, password, name, tenantName: storeName });
        login(res.data.accessToken, res.data.user);
      } else {
        const res = await authApi.login({ email, password });
        login(res.data.accessToken, res.data.user);
      }
      window.location.href = '/app/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">ProfitHub</Link>
          <p className="text-gray-500 mt-2">
            {isRegister ? 'Crie sua conta grátis' : 'Faça login na sua conta'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da sua loja
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minha Loja"
                  required={isRegister}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : isRegister ? 'Criar conta grátis' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isRegister ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
        
        <div className="mt-6 pt-6 border-t text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}
