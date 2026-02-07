import { Customer, Transaction, DashboardStats, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('[ApiService] Target URL:', API_URL);

class ApiService {
    private getHeaders() {
        try {
            const userStr = localStorage.getItem('bizflow_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.token) {
                    return {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    };
                }
            }
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
        }
        return {
            'Content-Type': 'application/json'
        };
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'API Request Failed');
        }

        const json = await res.json();
        return json.success ? json.data : json;
    }

    // Dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        return this.request('/dashboard/stats');
    }

    // Customers
    async getCustomers(): Promise<Customer[]> {
        const data = await this.request('/customers');
        return data.map((c: any) => ({
            ...c,
            id: c.id.toString(),
            createdAt: c.created_at,
            status: c.status || 'Active'
        }));
    }

    async addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
        const res = await this.request('/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });
        return { ...res, id: res.id.toString() };
    }

    async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
        const res = await this.request(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customer),
        });
        return { ...res, id: res.id.toString() };
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.request(`/customers/${id}`, {
            method: 'DELETE',
        });
    }

    // Transactions
    async getTransactions(): Promise<Transaction[]> {
        const data = await this.request('/transactions');
        return data.map((t: any) => ({
            ...t,
            id: t.id.toString(),
            customerId: t.customer_id.toString(),
            date: t.created_at,
            status: t.status === 'paid' ? 'Completed' : (t.status === 'cancelled' ? 'Cancelled' : 'Pending')
        }));
    }

    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const payload = {
            customer_id: transaction.customerId,
            amount: transaction.amount,
            status: transaction.status === 'Completed' ? 'paid' : (transaction.status === 'Cancelled' ? 'cancelled' : 'pending'),
            category: transaction.category
        };
        const res = await this.request('/transactions', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return { ...transaction, id: res.id.toString() };
    }

    async deleteTransaction(id: string): Promise<void> {
        await this.request(`/transactions/${id}`, {
            method: 'DELETE',
        });
    }

    // Market Reports
    async getMarketReports(): Promise<any[]> {
        return this.request('/market-reports');
    }

    // System Settings
    async getSettings(): Promise<any> {
        return this.request('/settings');
    }

    async updateSettings(settings: any): Promise<void> {
        await this.request('/settings', {
            method: 'POST',
            body: JSON.stringify(settings),
        });
    }

    // Auth
    async login(email: string, password: string): Promise<User> {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return data; // Assumes backend returns User object including token
    }

    async signup(name: string, email: string, password: string, company: string): Promise<User> {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, company }),
        });
        return data;
    }

    // Admin
    async getAdminStats(): Promise<any> {
        return this.request('/admin/stats');
    }

    async getAllUsers(): Promise<User[]> {
        return this.request('/admin/users');
    }

    async getMe(): Promise<User> {
        return this.request('/auth/me');
    }

    async updateProfile(profile: { name: string, email: string }): Promise<void> {
        await this.request('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(profile),
        });
    }

    // AI
    async getAiInsights(stats: DashboardStats): Promise<string> {
        return this.request('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({ stats }),
        });
    }
}

export const api = new ApiService();
