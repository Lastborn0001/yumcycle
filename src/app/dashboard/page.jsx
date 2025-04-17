"use client";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import Button from "@/components/ui/Button";
import Hero from "@/components/ui/Hero";
import HowItWork from "@/components/ui/HowItWork";
import Mission from "@/components/ui/Mission";
import PopularRestaurant from "@/components/ui/PopularRestaurant";
import { Clock, Map, Search, Truck } from "lucide-react";

export default function Dashboard() {
  return (
    <>
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
      <Footer />
    </>
  );
}
