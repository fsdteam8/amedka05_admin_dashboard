import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div className="w-full ">
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
