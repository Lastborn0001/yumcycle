"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { toast, Toaster } from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";

export default function AuthForms() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [forgetPassword, setforgetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Restaurant-specific fields
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantCuisine, setRestaurantCuisine] = useState("");

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const role = tokenResult.claims.role;
          // console.log("User role:", role);

          if (role === "admin") {
            router.push("/admin/dashboard");
          } else if (role === "restaurant") {
            router.push("/restaurant/dashboard");
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching token result:", error);
        }
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      } else {
        // Registration logic
        const registrationData = {
          email,
          password,
          name,
          role,
        };

        // Add restaurant data if registering as restaurant
        if (role === "restaurant") {
          registrationData.restaurantData = {
            name: restaurantName,
            location: restaurantAddress,
            cuisine: restaurantCuisine.split(",").map((c) => c.trim()),
          };
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Registration failed");
        }

        const userData = await response.json();

        if (role === "restaurant") {
          toast.success("Restaurant registration submitted for approval!");
        } else {
          toast.success("Account created successfully!");
        }

        // Sign in the user after successful registration
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google!");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full py-12 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Sign in to your account"
              : "Get started with your free account"}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Lois Olamide"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`py-2 px-3 border rounded-md text-sm font-medium flex items-center justify-center ${
                        role === "user"
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiUser className="mr-2" /> User
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("restaurant")}
                      className={`py-2 px-3 border rounded-md text-sm font-medium flex items-center justify-center ${
                        role === "restaurant"
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiBriefcase className="mr-2" /> Restaurant
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`py-2 px-3 border rounded-md text-sm font-medium flex items-center justify-center ${
                        role === "admin"
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      disabled
                      title="Admin accounts can only be created by existing admins"
                    >
                      <FiHome className="mr-2" /> Admin
                    </button> */}
                  </div>
                </div>

                {role === "restaurant" && (
                  <>
                    <div>
                      <label
                        htmlFor="restaurantName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Restaurant Name
                      </label>
                      <input
                        id="restaurantName"
                        name="restaurantName"
                        type="text"
                        required
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Delicious Eats"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="restaurantAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Restaurant Address
                      </label>
                      <input
                        id="restaurantAddress"
                        name="restaurantAddress"
                        type="text"
                        required
                        value={restaurantAddress}
                        onChange={(e) => setRestaurantAddress(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="123 Main St, City"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="restaurantCuisine"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cuisine Types (comma separated)
                      </label>
                      <input
                        id="restaurantCuisine"
                        name="restaurantCuisine"
                        type="text"
                        required
                        value={restaurantCuisine}
                        onChange={(e) => setRestaurantCuisine(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Nigerian, African, Continental"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={
                    isLogin ? "Your password" : "At least 6 characters"
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Register"}
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full cursor-pointer inline-flex justify-center items-center py-2 px-4 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Google
              </button>
            </div>
          </div>

          <div
            className={`mt-6 ${
              isLogin ? "flex justify-between" : "text-center"
            } text-sm`}
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium cursor-pointer text-orange-600 hover:text-orange-500 focus:outline-none"
            >
              {isLogin
                ? "Need an account? Register"
                : "Already have an account? Sign in"}
            </button>
            {isLogin ? (
              <a
                className="font-medium cursor-pointer text-orange-600 hover:text-orange-500 focus:outline-none"
                href="/"
              >
                Forgot Password
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
