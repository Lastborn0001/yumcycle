import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import ResHero from "@/components/ui/ResHero";
import SearchRes from "@/components/ui/SearchRes";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import Chatbot from "@/components/Chatbot";

const page = () => {
  return (
    <>
      <ProtectedRoute>
        <Nav />
        <main>
          {/* Hero */}
          <ResHero />
          {/* Search and Filter Section */}
          <SearchRes />
        </main>
        <Chatbot />
        <Footer />
      </ProtectedRoute>
    </>
  );
};

export default page;
