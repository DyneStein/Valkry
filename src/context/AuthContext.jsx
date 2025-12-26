import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { initUserStats } from '../services/userStats';
import { setPlayerOnline } from '../services/onlinePlayers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Map Firebase user to app's user structure
    const mapFirebaseUser = (firebaseUser) => {
        return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Commander',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
            handle: firebaseUser.email?.split('@')[0] || 'nomad'
        };
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Always use fresh Firebase data to get current photoURL
                const appUser = mapFirebaseUser(firebaseUser);
                setUser(appUser);
                localStorage.setItem('valkry_user', JSON.stringify(appUser));

                // Auto-initialize user stats so they appear in leaderboard
                initUserStats(appUser.id, appUser.name, appUser.avatar);
            } else {
                // Only use localStorage as fallback when truly signed out
                // but don't trust it for avatar data
                localStorage.removeItem('valkry_user');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Global Online Presence
    useEffect(() => {
        if (user) {
            const cleanup = setPlayerOnline({
                id: user.id,
                name: user.name,
                avatar: user.avatar
            });
            return () => cleanup();
        }
    }, [user]);

    // Google Sign In
    const loginGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        } catch (error) {
            console.error("Google Auth Error:", error);
            return { success: false, error: error.message };
        }
    };

    // Email Sign Up (Create Account)
    const signUpWithEmail = async (email, password, displayName) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Update the user's display name
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }
            return { success: true };
        } catch (error) {
            console.error("Sign Up Error:", error);
            let errorMessage = "Failed to create account";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email already in use";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password must be at least 6 characters";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            }
            return { success: false, error: errorMessage };
        }
    };

    // Email Sign In
    const loginWithEmail = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            let errorMessage = "Failed to sign in";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid email or password";
            }
            return { success: false, error: errorMessage };
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('valkry_user');
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
            localStorage.removeItem('valkry_user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            loginGoogle,
            loginWithEmail,
            signUpWithEmail,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
