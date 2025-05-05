import DashboardNavigation from "@/components/dashboard/header/DashboardNavigation"
import Link from "next/link";

export default function BreadCrumbHeader({ 
  title = "",
  description = "",
  actionBtn = false,
  actionBtnText = "",
  actionBtnLink = ""
}) {
  return (
    <div className="row pb40">
      <div className="col-lg-12">
        <DashboardNavigation />
      </div>
      <div className={`col-lg-${actionBtn ? '9' : '12'}`}>
        <div className="dashboard_title_area">
          <h2>{title}</h2>
          <p className="text">{description}</p>
        </div>
      </div>
      {actionBtn && (
        <div className="col-lg-3">
          <div className="text-lg-end">
            <Link
              href={actionBtnLink}
              className="ud-btn btn-dark default-box-shadow2"
            >
              {actionBtnText}
              <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}