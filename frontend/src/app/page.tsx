'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">ProfitHub</h1>
          <Link 
            href="/login" 
            className="text-white hover:text-blue-200 transition px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
          >
            Entrar
          </Link>
        </header>

        <main className="max-w-6xl mx-auto">
          <section className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Descubra seu lucro real<br />
              <span className="text-yellow-300">vendendo online ou em loja</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Controle suas vendas, calcule seu lucro automaticamente e nunca mais
              trabalhe de graça vendendo em marketplaces.
            </p>
            <Link
              href="/login"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              Testar grátis
            </Link>
          </section>

          <section className="mb-20">
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Você sofre com isso?
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-5xl mb-4">😕</div>
                  <p className="text-lg text-gray-700">
                    Vende, mas não sabe quanto ganha de verdade
                  </p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-5xl mb-4">💸</div>
                  <p className="text-lg text-gray-700">
                    As taxas comem seu lucro sem você perceber
                  </p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-5xl mb-4">📉</div>
                  <p className="text-lg text-gray-700">
                    Acha que lucra, mas na verdade empobrece
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-10 text-center">
              A solução é simples
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Cálculo automático
                </h4>
                <p className="text-blue-100">
                  Lucro calculado em segundos, considerando todas as taxas
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Controle de estoque
                </h4>
                <p className="text-blue-100">
                  Nunca mais ficou sem produto na hora da venda
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🔔</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Alertas inteligentes
                </h4>
                <p className="text-blue-100">
                  Seja avisado quando algo der errado
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                Como funciona
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Cadastre seus produtos</h4>
                  <p className="text-gray-600">Informe o nome e quanto você paga por cada um</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Registre suas vendas</h4>
                  <p className="text-gray-600">Adicione o valor de venda, taxa e frete</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Veja seu lucro real</h4>
                  <p className="text-gray-600">Sem complicação, sem planilha</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-white rounded-3xl p-10 shadow-2xl text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Pronto para descobrir seu lucro real?
              </h3>
              <p className="text-gray-600 mb-8">
                Comece grátis e controle suas vendas hoje mesmo.
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-full transition"
              >
                Começar agora
              </Link>
            </div>
          </section>

          <section id="pricing" className="mb-20">
            <h3 className="text-3xl font-bold text-white mb-10 text-center">
              Planos simples
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl p-10 shadow-2xl">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">Grátis</h4>
                <p className="text-4xl font-bold text-gray-800 mb-6">
                  R$ 0<span className="text-lg font-normal text-gray-500">/mês</span>
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Até 50 produtos
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    100 pedidos/mês
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Dashboard básico
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center border-2 border-blue-600 text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition"
                >
                  Começar grátis
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  RECOMENDADO
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Pro</h4>
                <p className="text-4xl font-bold text-white mb-6">
                  R$ 29<span className="text-lg font-normal text-blue-200">/mês</span>
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span>
                    Produtos ilimitados
                  </li>
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span>
                    Pedidos ilimitados
                  </li>
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span>
                    Relatórios avançados
                  </li>
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span>
                    Suporte prioritário
                  </li>
                </ul>
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition">
                  Em breve
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center text-blue-200 py-8">
          <p>© 2026 ProfitHub. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
