import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileNavigation2 from "@/components/header/MobileNavigation2";
import ProjectDetailWrapper from "./components/ProjectDetailWrapper";

export const metadata = {
  title:
    "Fairlancer - Freelance Marketplace | Projects Details",
};


export default async function Page() {
  return (
    <>
      <MobileNavigation2 />
      <DashboardLayout>
        <ProjectDetailWrapper/>
      </DashboardLayout>
    </>
  );
}