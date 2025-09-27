import { api } from "./api";

export type Expense = {
  id: string;
  userId: string;
  categoryId: number;
  description: string;
  amount: string;    
  isFixed: boolean;
  createdAt: string; 
  updatedAt: string;
  category?: { id: number; name: string };
};

export type ExpensePage = {
  data: Expense[];
  total: number;
};

export async function getRecentExpenses(page = 1, limit = 5): Promise<Expense[]> {
  const { data } = await api.get<ExpensePage>("/expense", {
    params: { page, limit },
  });
  return (data?.data ?? []).slice().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function getExpenseByPeriod(startDate: string, endDate: string): Promise<any> {
  const { data } = await api.get<any>("/expense/total", {
    params: { startDate, endDate },
  });
  return data
}
