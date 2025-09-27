"use client";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/libs/AuthContext";
import Loading from "@/components/ui/Loading";
import dynamic from "next/dynamic";

const PWAInstallPrompt = dynamic(
  () => import("@/components/ui/PWAInstallPrompt"),
  { ssr: false }
);

function InnerLayout({ children }) {
  const { loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
