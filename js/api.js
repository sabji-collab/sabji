// API Utility Functions

const API_BASE_URL = window.API_BASE_URL || 'https://your-railway-app.railway.app/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Products API
const productsAPI = {
    async getAll(category = null) {
        const endpoint = category ? `/products?category=${category}` : '/products';
        return await apiCall(endpoint);
    },
    
    async getById(id) {
        return await apiCall(`/products/${id}`);
    },
    
    async create(product, token) {
        return await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    async update(id, product, token) {
        return await apiCall(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    async delete(id, token) {
        return await apiCall(`/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    async updateStock(id, stock, token) {
        return await apiCall(`/products/${id}/stock`, {
            method: 'PUT',
            body: JSON.stringify({ stock }),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

// Orders API
const ordersAPI = {
    async create(order) {
        return await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(order)
        });
    },
    
    async getAll(token) {
        return await apiCall('/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    async getById(id, token) {
        return await apiCall(`/orders/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    async updateStatus(id, status, token) {
        return await apiCall(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

// Business Info API
const businessInfoAPI = {
    async get() {
        return await apiCall('/business-info');
    },
    
    async update(data, token) {
        return await apiCall('/business-info', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

// Admin API
const adminAPI = {
    async login(username, password) {
        return await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }
};

// Export for use in HTML
window.productsAPI = productsAPI;
window.ordersAPI = ordersAPI;
window.businessInfoAPI = businessInfoAPI;
window.adminAPI = adminAPI;

