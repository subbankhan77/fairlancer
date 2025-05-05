import DashboardNavigation from "../header/DashboardNavigation";
import Award from "./Award";
import ChangePassword from "./ChangePassword";
import ConfirmPassword from "./ConfirmPassword";
import Education from "./Education";
import ProfileDetails from "./ProfileDetails";
import Skill from "./Skill";
import WorkExperience from "./WorkExperience";

import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";

export default function MyProfileInfo() {
  return (
    <>
      <div className="dashboard__content hover-bgc-color pt20">
        <Breadcumb path={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "My Profile", link: "#" },
        ]}/>
        <BreadCrumbHeader
          title="My Profile"
          description="Manage your profile details"
        />
        <div className="row">
          <div className="col-xl-12">
            <ProfileDetails />
            {/* <Skill />
            <Education />
            <WorkExperience />
            <Award />
            <ChangePassword />
            <ConfirmPassword /> */}
          </div>
        </div>
      </div>
    </>
  );
}
