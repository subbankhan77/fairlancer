import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageProjectInfo from "@/components/dashboard/section/ManageProjectInfo";
import ManageProjectInfoFreelancer from "@/components/dashboard/section/ManageProjectInfoFreelancer";
import MobileNavigation2 from "@/components/header/MobileNavigation2";
import getServerSession from "@/lib/getServerSession";

export const metadata = {
  title: "Fairlancer - Freelance Marketplace | Projects",
};

export default async function Page() {
  const session = await getServerSession();
  const userRole = session?.user?.role || "client"; // Default to client if role is not available

  return (
    <>
      <MobileNavigation2 />
      <DashboardLayout>
        {userRole === "freelancer" ? (
          <ManageProjectInfoFreelancer />
        ) : (
          <ManageProjectInfo />
        )}
      </DashboardLayout>
    </>
  );
}