"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <>
      <ProtectedRoute>
        <div>
          <h1>order</h1>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default page;
