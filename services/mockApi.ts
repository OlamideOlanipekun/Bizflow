
import { Customer, Transaction, DashboardStats, User, UserRole } from '../types';

// Mock DB Initial State
const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@techcorp.com', company: 'TechCorp', status: 'Active', createdAt: '2023-10-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@designhub.io', company: 'DesignHub', status: 'Active', createdAt: '2023-11-15' },
  { id: '3', name: 'Robert Brown', email: 'robert@builders.net', company: 'Build-It', status: 'Inactive', createdAt: '2024-01-20' },
  { id: '4', name: 'Alice Wilson', email: 'alice@marketing.co', company: 'MarketMasters', status: 'Lead', createdAt: '2024-02-10' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@logistics.com', company: 'Davis Trans', status: 'Active', createdAt: '2024-03-05' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', customerId: '1', customerName: 'John Doe', amount: 1500, date: '2024-03-01', status: 'Completed', category: 'Software' },
  { id: 't2', customerId: '2', customerName: 'Jane Smith', amount: 850, date: '2024-03-02', status: 'Completed', category: 'Design' },
  { id: 't3', customerId: '1', customerName: 'John Doe', amount: 1200, date: '2024-03-05', status: 'Pending', category: 'Consulting' },
  { id: 't4', customerId: '5', customerName: 'Charlie Davis', amount: 2400, date: '2024-03-10', status: 'Completed', category: 'Logistics' },
  { id: 't5', customerId: '3', customerName: 'Robert Brown', amount: 500, date: '2024-03-12', status: 'Cancelled', category: 'Repair' },
  { id: 't6', customerId: '2', customerName: 'Jane Smith', amount: 1100, date: '2024-03-15', status: 'Completed', category: 'Design' },
];

class MockApiService {
  private customers: Customer[] = JSON.parse(localStorage.getItem('bizflow_customers') || JSON.stringify(INITIAL_CUSTOMERS));
  private transactions: Transaction[] = JSON.parse(localStorage.getItem('bizflow_transactions') || JSON.stringify(INITIAL_TRANSACTIONS));

  private persist() {
    localStorage.setItem('bizflow_customers', JSON.stringify(this.customers));
    localStorage.setItem('bizflow_transactions', JSON.stringify(this.transactions));
  }

  // Auth
  async login(email: string, pass: string): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    // Hardcoded mock user for demo
    return {
      id: 'admin-1',
      name: 'Alex Johnson',
      email: email,
      role: UserRole.ADMIN,
      avatar: `https://picsum.photos/seed/${email}/200`
    };
  }

  async signup(name: string, email: string, pass: string, company: string): Promise<User> {
    await new Promise(r => setTimeout(r, 1500));
    // In a real app, we'd save the user. Here we just return a new mock user.
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.ADMIN,
      avatar: `https://picsum.photos/seed/${email}/200`
    };
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 500));
    const totalRevenue = this.transactions
      .filter(t => t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalCustomers: this.customers.length,
      totalTransactions: this.transactions.length,
      totalRevenue,
      monthlyGrowth: 12.5,
      revenueChart: [
        { month: 'Oct', amount: 12000 },
        { month: 'Nov', amount: 15000 },
        { month: 'Dec', amount: 13500 },
        { month: 'Jan', amount: 18000 },
        { month: 'Feb', amount: 22000 },
        { month: 'Mar', amount: 24500 },
      ],
      recentTransactions: [...this.transactions].reverse().slice(0, 5),
    };
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.customers.push(newCustomer);
    this.persist();
    return newCustomer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const idx = this.customers.findIndex(c => c.id === id);
    this.customers[idx] = { ...this.customers[idx], ...updates };
    this.persist();
    return this.customers[idx];
  }

  async deleteCustomer(id: string): Promise<void> {
    this.customers = this.customers.filter(c => c.id !== id);
    this.persist();
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTx: Transaction = {
      ...transaction,
      id: 't' + Math.random().toString(36).substr(2, 9),
    };
    this.transactions.push(newTx);
    this.persist();
    return newTx;
  }
}

export const api = new MockApiService();
