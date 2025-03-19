export const Loader = () => (
  <div className="flex w-full items-center justify-center">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5 h-5 bg-gradient-to-r from-[#101828] to-[#FF9B05] rounded-full animate-pulse"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center animate-spin">
        <div className="w-6 h-6 border-2 border-dashed border-[#ECF5FF] rounded-full"></div>
      </div>
    </div>
  </div>
);
