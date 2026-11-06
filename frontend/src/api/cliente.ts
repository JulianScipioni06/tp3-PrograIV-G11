const API_URL = 'http://localhost:3000'; 

export const apiClient = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        },
    });
    return response;
};