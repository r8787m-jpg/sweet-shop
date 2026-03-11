// Sweet Shop - Main JavaScript

// API Base URL
const API_URL = '';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await res.json();
    } catch (err) {
        console.error('API Error:', err);
        return null;
    }
}

// Format currency
function formatCurrency(amount) {
    return `${amount} ر.س`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar');
}

// Show notification
function showNotification(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    alert.style.zIndex = '9999';
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => alert.remove(), 3000);
}

// Export functions
window.apiCall = apiCall;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.showNotification = showNotification;
