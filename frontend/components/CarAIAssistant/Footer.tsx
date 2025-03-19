import React from "react";
import Image from "next/image";

export const Footer = () => (
  <div className="h-11 w-full bg-[#F2F4F8] flex items-center justify-center gap-0.5">
    {/* <Image src={PowerhouseLogo} width={24} height={24} alt="Powerhouse Logo" /> */}
    <div>
      <div className="text-[#001D6C] text-[6px] font-light">Powered by</div>
      <div className="text-[#001D6C] text-[10px] font-bold">SuperCar Motors</div>
    </div>
  </div>
);