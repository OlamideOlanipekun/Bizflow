
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive' | 'Lead';
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  category: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyGrowth: number;
  revenueChart: { month: string; amount: number }[];
  recentTransactions: Transaction[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
