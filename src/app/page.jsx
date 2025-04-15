// "use client";
// import { useEffect } from "react";
// import { auth } from "@/libs/firebaseClient";
// import { onAuthStateChanged } from "firebase/auth";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import RegisterForm from "@/components/auth/RegisterForm";
// export default function Home() {
//   const loginWithGoogle = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(auth, provider).then((result) => {
//       console.log("Logged in:", result.user);
//     });
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const token = await user.getIdToken();
//         console.log(token);
//         const res = await fetch("/api/auth/login", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         console.log("Login response:", data);
//       } else {
//         console.error("User not logged in");
//       }
//     });

//     return () => unsubscribe();
//   }, []);
//   return (
//     <>
//       <h1>hello</h1>
//       <button onClick={loginWithGoogle}>login</button>
//       <RegisterForm />
//     </>
//   );
// }

import AuthForms from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <AuthForms />
    </main>
  );
}
