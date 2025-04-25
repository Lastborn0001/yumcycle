"use client";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import Hero from "@/components/ui/Hero";
import HowItWork from "@/components/ui/HowItWork";
import Mission from "@/components/ui/Mission";
import PopularRestaurant from "@/components/ui/PopularRestaurant";
import ProtectedRoute from "@/components/ProtectedRoute";
import Chatbot from "@/components/Chatbot";
export default function Dashboard() {
  return (
    <>
      <ProtectedRoute>
        <header>
          <Nav />
        </header>
        <main>
          {/* Hero Section */}
          <Hero />
          {/* popular restaurants */}
          <PopularRestaurant />
          {/* How it works */}
          <HowItWork />
          {/* Mission */}
          <Mission />
        </main>
        <Chatbot />
        <Footer />
      </ProtectedRoute>
    </>
  );
}
