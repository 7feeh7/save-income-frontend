import { api } from "./api";

export type Income = {
  id: string;
  userId: string;
  description: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
};

export type IncomePage = {
  data: Income[];
  total: number;
};

export async function getRecentIncomes(page = 1, limit = 5): Promise<Income[]> {
  const { data } = await api.get<IncomePage>("/income", {
    params: { page, limit },
  });
  return (data?.data ?? []).slice().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function getIncomeTotalByPeriod(startDate: string, endDate: string): Promise<any> {
  const { data } = await api.get<any>("/income/total", {
    params: { startDate, endDate },
  });
  return data
}

