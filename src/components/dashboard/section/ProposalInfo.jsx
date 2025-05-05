import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";

export default function ProposalInfo() {
  return (
    <>
      <div className="dashboard__content hover-bgc-color pt20">
        <Breadcumb path={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Proposals", link: "/proposals" },
        ]}/>
        <BreadCrumbHeader
          title="My Proposals"
          description="Proposals List"
        />
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative h-100">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
