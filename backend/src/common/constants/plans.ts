export const PLANS = {
  FREE: {
    name: 'Grátis',
    price: 0,
    limits: {
      maxProducts: 50,
      maxOrdersPerMonth: 100,
      maxAlertsPerMonth: 10,
      features: ['Dashboard básico', 'Produtos', 'Pedidos', 'Alertas'],
    },
  },
  PRO: {
    name: 'Pro',
    price: 29,
    limits: {
      maxProducts: Infinity,
      maxOrdersPerMonth: Infinity,
      maxAlertsPerMonth: Infinity,
      features: [
        'Produtos ilimitados',
        'Pedidos ilimitados',
        'Relatórios avançados',
        'Suporte prioritário',
        'Alertas ilimitados',
      ],
    },
  },
} as const;

export type PlanType = 'FREE' | 'PRO';

export function checkLimit(
  plan: PlanType,
  currentCount: number,
  limitType: 'maxProducts' | 'maxOrdersPerMonth' | 'maxAlertsPerMonth'
): { allowed: boolean; remaining: number } {
  const limit = PLANS[plan].limits[limitType];
  
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity };
  }
  
  const remaining = limit - currentCount;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}
