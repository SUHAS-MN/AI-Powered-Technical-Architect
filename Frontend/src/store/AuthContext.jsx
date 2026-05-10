import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            // Corrected path from /users/ to /auth/
            const response = await api.get('/auth/current-user');
            setUser(response.data.data);
        } catch (error) {
            localStorage.removeItem('accessToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (userData, token) => {
        setUser(userData);
        localStorage.setItem('accessToken', token);
    };

    const logout = async () => {
        try {
            // Corrected path from /users/ to /auth/
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem('accessToken');
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
