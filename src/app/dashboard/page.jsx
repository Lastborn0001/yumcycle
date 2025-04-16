"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import Nav from "@/components/layout/Nav";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {user?.displayName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="font-medium">
                  {user?.metadata?.creationTime &&
                    new Date(user.metadata.creationTime).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Sign In</p>
                <p className="font-medium">
                  {user?.metadata?.lastSignInTime &&
                    new Date(user.metadata.lastSignInTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Add more dashboard sections as needed */}
        </div>
      </main>
    </>
  );
}
