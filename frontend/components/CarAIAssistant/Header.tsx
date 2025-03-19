import React from "react";

export const Header = () => (
  <div className="fixed top-0 w-full z-10">
    <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90.59deg, #00469B 0.51%, #00171F 144.1%)' }} />
    <div className="flex items-center justify-between bg-[#F2F4F8] p-2">
      <div className="inline-flex items-center gap-2">
        <div className="rounded-lg shadow-md">
          {/* <BgOrangeSparkles /> */}
        </div>
        <span className="text-sm font-semibold !leading-[18px] text-[#060C18]">
          SuperCar Virtual Sales Assistant
        </span>
      </div>
    </div>
  </div>
);