import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Sign in to Firebase first
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Firebase Login Error:', error);
            // We still proceed to backend login unless we want to strictly sync
        }

        const response = await authService.login({ email, password });
        const { user: userData, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    };

    const register = async (name, email, password, role, profileImage) => {
        // Create user in Firebase first
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Firebase Registration Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Email already registered in Firebase');
            }
            throw error;
        }

        const response = await authService.register({ name, email, password, role, profileImage });
        const { user: userData, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const response = await authService.googleLogin({
                name: user.displayName,
                email: user.email,
                profileImage: user.photoURL
            });

            const { user: userData, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Firebase Logout Error:', error);
        }
        authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
