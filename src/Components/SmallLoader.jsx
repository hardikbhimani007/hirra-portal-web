import React from "react";

const SmallLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-gray-400 h-8 w-8"></div>
    </div>
  );
};

export default SmallLoader;
