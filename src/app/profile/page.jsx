"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { toast, Toaster } from "react-hot-toast";
import { LogOut, Edit } from "lucide-react";
import Nav from "@/components/layout/Nav";
import UserProfileEditModal from "@/components/ui/UserProfileEditModal";

const page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/");
        setLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();

        // Sync user data to MongoDB
        const syncResponse = await fetch("/api/users", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!syncResponse.ok) {
          const errorData = await syncResponse.json();
          throw new Error(errorData.error || "Failed to sync user data");
        }

        // Fetch user profile
        const profileResponse = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }

        const userData = await profileResponse.json();
        const mergedUser = {
          ...currentUser,
          name: userData.name || currentUser.displayName,
          email: userData.email || currentUser.email,
          photoURL: userData.photoURL || currentUser.photoURL,
        };
        setUser(mergedUser);
        console.log("User data:", {
          name: mergedUser.name,
          email: mergedUser.email,
          firebasePhotoURL: currentUser.photoURL,
          mongoPhotoURL: userData.photoURL,
        });
      } catch (err) {
        toast.error(err.message);
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to log out: " + err.message);
      console.error("Logout error:", err);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      name: updatedUser.name,
      email: updatedUser.email,
      photoURL: updatedUser.photoURL,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <header>
        <Nav />
      </header>
      <main className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Log Out"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || "User"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-orange-500 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-orange-500">
                  <span className="text-gray-500 text-2xl">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name || "User"}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {user.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium text-gray-900">
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Sign In</p>
              <p className="font-medium text-gray-900">
                {user.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default page;
