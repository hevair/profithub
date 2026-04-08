import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProfitHub - Descubra seu lucro real em vendas online e em estabelecimento',
  description: 'Controle suas vendas, calcule seu lucro e nunca mais trabalhe de graça vendendo em marketplaces.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
