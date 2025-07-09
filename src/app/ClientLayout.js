"use client";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/libs/AuthContext";
import Loading from "@/components/ui/Loading";

function InnerLayout({ children }) {
  const { loading } = useAuth();

  if (loading) return <Loading />;

  return children;
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
