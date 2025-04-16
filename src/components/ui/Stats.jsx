import { Leaf, Utensils } from "lucide-react";
import React from "react";

const Stats = () => {
  return (
    <section className="mb-12 rounded-xl bg-gray-100 p-6">
      <h2 className="mb-4 text-center text-2xl font-semibold">Our mission</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-orange-100 p-6 text-center">
          <div className="mb-2 flex justify-center">
            <Utensils className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-sm font-medium uppercase text-muted-foreground">
            Meals Saved
          </h3>
          <p className="text-3xl font-bold text-orange-600">9,500</p>
        </div>

        <div className="rounded-lg bg-green-100 p-6 text-center">
          <div className="mb-2 flex justify-center">
            <Leaf className="h-8 w-8 text-green-700" />
          </div>
          <h3 className="text-sm font-medium uppercase text-muted-foreground">
            CO2 Reduced
          </h3>
          <p className="text-3xl font-bold text-green-700">9,250 kg</p>
        </div>

        <div className="rounded-lg bg-blue-100 p-6 text-center">
          <div className="mb-2 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-700"
            >
              <path d="M12 22a8 8 0 0 0 8-8c0-5-8-13-8-13S4 9 4 14a8 8 0 0 0 8 8Z"></path>
            </svg>
          </div>
          <h3 className="text-sm font-medium uppercase text-muted-foreground">
            Water Saved
          </h3>
          <p className="text-3xl font-bold text-blue-700">18,000 L</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
