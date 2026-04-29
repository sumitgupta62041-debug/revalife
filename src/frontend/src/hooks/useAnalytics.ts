import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useAdmin } from "./useAdmin";

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalProducts: number;
}

export interface DayStat {
  date: string;
  value: number;
}

export interface StatusStat {
  status: string;
  count: number;
}

export interface TopProduct {
  rank: number;
  id: string;
  name: string;
  unitsSold: number;
}

export interface PaymentStat {
  method: string;
  count: number;
}

export function useAnalyticsSummary() {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      if (!actor)
        return {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          totalProducts: 0,
        };
      const raw = await actor.getAnalyticsSummary();
      return {
        totalRevenue: Number(raw.totalRevenue),
        totalOrders: Number(raw.totalOrders),
        avgOrderValue: Number(raw.avgOrderValue),
        totalProducts: Number(raw.totalProducts),
      };
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}

export function useRevenueByDay(days = 30) {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<DayStat[]>({
    queryKey: ["analytics", "revenueByDay", days],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getRevenueByDay(BigInt(days));
      return raw.map(([date, value]) => ({ date, value: Number(value) }));
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}

export function useOrdersByDay(days = 30) {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<DayStat[]>({
    queryKey: ["analytics", "ordersByDay", days],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getOrdersByDay(BigInt(days));
      return raw.map(([date, value]) => ({ date, value: Number(value) }));
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}

export function useOrdersByStatus() {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<StatusStat[]>({
    queryKey: ["analytics", "ordersByStatus"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getOrdersByStatus();
      return raw.map(([status, count]) => ({ status, count: Number(count) }));
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}

export function useTopSellingProducts(limit = 10) {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<TopProduct[]>({
    queryKey: ["analytics", "topProducts", limit],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getTopSellingProducts(BigInt(limit));
      return raw.map(([id, name, unitsSold], i) => ({
        rank: i + 1,
        id,
        name,
        unitsSold: Number(unitsSold),
      }));
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}

export function usePaymentMethodBreakdown() {
  const { actor, isFetching } = useActor();
  const { isAdmin } = useAdmin();

  return useQuery<PaymentStat[]>({
    queryKey: ["analytics", "paymentBreakdown"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getPaymentMethodBreakdown();
      return raw.map(([method, count]) => ({ method, count: Number(count) }));
    },
    enabled: !!actor && !isFetching && isAdmin,
    staleTime: 30_000,
  });
}
