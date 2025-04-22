"use client";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/libs/AuthContext";

function InnerLayout({ children }) {
  const { loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  return children;
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
