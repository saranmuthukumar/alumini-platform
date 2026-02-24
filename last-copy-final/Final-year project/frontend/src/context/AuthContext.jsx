import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage synchronously to prevent flash
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [profile, setProfile] = useState(() => {
        try {
            const stored = localStorage.getItem('profile');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [loading, setLoading] = useState(true);

    // Validate session on mount (but don't clear if it fails)
    useEffect(() => {
        const checkAuth = async () => {
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');

            if (storedAccessToken && storedUser) {
                try {
                    const res = await api.get('/auth/me');
                    if (res.data.success) {
                        setUser(res.data.data.user);
                        setProfile(res.data.data.profile);
                        localStorage.setItem('user', JSON.stringify(res.data.data.user));
                        localStorage.setItem('profile', JSON.stringify(res.data.data.profile));
                    }
                } catch (error) {
                    // If /auth/me fails, keep the locally stored user state.
                    // The api.js interceptor will handle token refresh automatically.
                    // Only clear if we truly have no valid tokens left.
                    const stillHasToken = localStorage.getItem('accessToken');
                    if (!stillHasToken) {
                        // Interceptor already cleared everything
                        setUser(null);
                        setProfile(null);
                    }
                    // Otherwise keep the user logged in with cached data
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            if (res.data.success) {
                const { user, accessToken, refreshToken } = res.data.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);

                try {
                    const profileRes = await api.get('/auth/me');
                    if (profileRes.data.success) {
                        setProfile(profileRes.data.data.profile);
                        localStorage.setItem('profile', JSON.stringify(profileRes.data.data.profile));
                    }
                } catch (e) {
                    console.error("Error fetching profile details", e);
                }

                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);

            if (res.data.success) {
                const { user, accessToken, refreshToken } = res.data.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);

                try {
                    const profileRes = await api.get('/auth/me');
                    if (profileRes.data.success) {
                        setProfile(profileRes.data.data.profile);
                        localStorage.setItem('profile', JSON.stringify(profileRes.data.data.profile));
                    }
                } catch (e) {
                    console.error("Error fetching profile details", e);
                }

                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
        setUser(null);
        setProfile(null);
    };

    const value = {
        user,
        profile,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
