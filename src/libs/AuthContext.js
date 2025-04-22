"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/libs/firebase-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const authStateChanged = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Skip if we've already processed this auth state
      if (authStateChanged.current) return;
      authStateChanged.current = true;

      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          const response = await fetch("/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = response.ok ? await response.json() : {};
          setUser({
            ...firebaseUser,
            name: userData.name || firebaseUser.displayName,
            email: userData.email || firebaseUser.email,
            photoURL: userData.photoURL || firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(firebaseUser); // Fallback to basic user info
      } finally {
        setLoading(false);
        authStateChanged.current = false;
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading, auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
