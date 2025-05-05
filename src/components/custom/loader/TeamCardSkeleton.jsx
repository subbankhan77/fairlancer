import React from "react";

const TeamCardSkeleton = () => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="listing-style1 list-details">
        <div className="card border p-4 mb30">
          <div className="card-header d-flex justify-content-between align-items-center border-0 p-0 mb20">
            <div className="d-flex align-items-center">
              <div className="icon me-2 skeleton-box" style={{ width: "24px", height: "24px" }}></div>
              <h5 className="title mb-0 skeleton-box" style={{ width: "150px", height: "24px" }}></h5>
            </div>
            <div className="skeleton-box" style={{ width: "30px", height: "30px", borderRadius: "50%" }}></div>
          </div>

          <div className="card-body p-0">
            <div className="skeleton-box mb15" style={{ width: "100%", height: "40px" }}></div>
            
            <div className="d-flex align-items-center mb15">
              <div className="skeleton-box me-2" style={{ width: "60px", height: "16px" }}></div>
              <div className="skeleton-box" style={{ width: "80px", height: "16px" }}></div>
            </div>
            
            <div className="d-flex align-items-center mb15">
              <div className="skeleton-box me-2" style={{ width: "60px", height: "16px" }}></div>
              <div className="skeleton-box" style={{ width: "100px", height: "16px" }}></div>
            </div>

            <div className="mt15">
              <div className="skeleton-box mb10" style={{ width: "120px", height: "20px" }}></div>
              <div className="position-relative d-flex align-items-center">
                <div className="d-flex">
                  {[1, 2, 3].map((_, index) => (
                    <div 
                      key={index} 
                      className="skeleton-box rounded-circle ms-n2 border border-white"
                      style={{ width: "35px", height: "35px", zIndex: 3 - index }}
                    ></div>
                  ))}
                </div>
                <div className="skeleton-box ms-3" style={{ width: "40px", height: "16px" }}></div>
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <div className="skeleton-box" style={{ width: "100%", height: "40px", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCardSkeleton;

// Add this CSS to your global styles
/*
.skeleton-box {
  display: inline-block;
  position: relative;
  overflow: hidden;
  background-color: #DDDBDD;
  border-radius: 4px;
}

.skeleton-box::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
*/