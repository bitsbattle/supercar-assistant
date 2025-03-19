import React from "react";

export const WelcomeMessage = () => (
  <>
    <div className="text-xl font-bold text-gray-900">
      Welcome to SuperCar,
      <br />
      <span className="bg-[linear-gradient(105.36deg,#101828_0%,#000D36_13.18%,#FF9B05_90.11%)] bg-clip-text text-transparent">
        How can we assist you today?
      </span>
    </div>
    <div className="mt-2 text-xs font-normal text-[#667085]">
      I'm Lex, your virtual sales assistant. I can help with test drives, dealership info, and more!
    </div>
  </>
);