import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div className="w-full mt-[80px] p-6">
          {/* <AppProvider> */}
            {children}
            {/* </AppProvider> */}
        </div>
      </div>
    </>
  );
}

export default layout;
