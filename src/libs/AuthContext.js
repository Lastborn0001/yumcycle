"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/libs/firebase-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Merged user for display
  const [firebaseUser, setFirebaseUser] = useState(null); // Raw Firebase User for auth
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const authStateChanged = useRef(false);

  useEffect(() => {
    console.log("AuthContext: Initializing onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (authStateChanged.current) {
          console.log("AuthContext: Skipping duplicate auth state change");
          return;
        }
        authStateChanged.current = true;

        try {
          console.log("Auth state changed:", {
            uid: firebaseUser?.uid,
            email: firebaseUser?.email,
            hasGetIdToken: typeof firebaseUser?.getIdToken === "function",
          });
          if (firebaseUser) {
            const token = await firebaseUser.getIdToken();
            const response = await fetch("/api/users/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });

            const userData = response.ok ? await response.json() : {};
            setFirebaseUser(firebaseUser); // Preserve raw Firebase User
            setUser({
              ...firebaseUser, // Copy enumerable properties
              name: userData.name || firebaseUser.displayName,
              email: userData.email || firebaseUser.email,
              photoURL: userData.photoURL || firebaseUser.photoURL,
            });
          } else {
            console.log("No Firebase user, setting null");
            setFirebaseUser(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Auth error:", error);
          setFirebaseUser(firebaseUser); // Fallback to Firebase user
          setUser(firebaseUser); // Fallback to basic user info
        } finally {
          console.log("AuthContext: Setting loading to false");
          setLoading(false);
          authStateChanged.current = false;
        }
      },
      (error) => {
        console.error("Auth state error:", error);
        setFirebaseUser(null);
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      console.log("AuthContext: Cleaning up onAuthStateChanged");
      unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, auth }}>
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
