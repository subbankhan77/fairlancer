import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageTeamInfo from "@/components/dashboard/section/ManageTeamInfo";

const TeamsPage = () => {
  return (
    <DashboardLayout>
      <ManageTeamInfo />
    </DashboardLayout>
  );
};

export default TeamsPage;