import React from "react";
import OverViewCard from "./OverViewCard";
import { ActiveCreatorsAgents } from "./ActiveCreatorsAgents";
import { TripsChart } from "./TripsChart";
import { ContactReports } from "./ContactReports";

function OverView() {
  return (
    <div>
      <OverViewCard />
      <div className="flex flex-col lg:flex-row gap-6 justify-center px-10">
        <div className="w-2/3">
          <ActiveCreatorsAgents />
        </div>
        <div className="flex-1">
          <TripsChart />
        </div>
      </div>
      <div className="p-10">
        <ContactReports />
      </div>
    </div>
  );
}

export default OverView;
