import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const { data } = await axios.post(
        'https://jums-sever.onrender.com/api/auth/login',
        { email, password },
        config
      );

      // Save user info and token
      setUser(data);
      localStorage.setItem('admin_user', JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to login' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`https://jums-sever.onrender.com/api/auth/forgotpassword`, { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.put(`https://jums-sever.onrender.com/api/auth/resetpassword/${token}`, { password: newPassword });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
