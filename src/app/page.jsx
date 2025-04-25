"use client";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import FoodWaste from "@/components/ui/FoodWaste";
import FoodWasteMatter from "@/components/ui/FoodWasteMatter";
import Help from "@/components/ui/Help";
import Stats from "@/components/ui/Stats";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="lg:w-[80%] w-full m-auto ">
        <FoodWaste />
        {/* Stats Section */}
        <Stats />
        {/* why food waste matter */}
        <FoodWasteMatter />
        {/* help */}
        <Help />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
