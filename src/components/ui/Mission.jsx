import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

const Mission = () => {
  const router = useRouter();
  return (
    <section className="bg-orange-500 py-16">
      <div className="container m-auto">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Join Our Mission to Reduce Food Waste
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Together, we can make a difference. Start ordering from restaurants
            that care about sustainability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => {
                router.push("/restaurants");
              }}
              className={
                "bg-green-400 h-11 rounded-md px-8 cursor-pointer text-white transition hover:bg-green-500"
              }
              name={"Explore Restaurants"}
            />
            <Button
              onClick={() => {
                router.push("/foodWaste");
              }}
              className="bg-transparent cursor-pointer border h-11 rounded-md px-8 border-input text-white bg-background transition hover:bg-white hover:text-orange-400"
              name={"Learn About Our Initiatives"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
