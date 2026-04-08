import { useState, useEffect } from 'react';

interface PlanInfo {
  plan: string;
  planName: string;
  price: number;
}

export function usePlan() {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanInfo();
  }, []);

  const loadPlanInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setPlanInfo({ plan: data.plan, planName: data.planName, price: data.price });
      }
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
    } finally {
      setLoading(false);
    }
  };

  return { planInfo, loading, refresh: loadPlanInfo };
}
