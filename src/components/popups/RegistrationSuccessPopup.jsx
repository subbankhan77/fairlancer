"use client";

import React from "react";

const RegistrationSuccessPopup = ({ isOpen, onClose, userData = {} }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: "block", zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registration Successful</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <div className="icon-success mb20">
                  <i className="fas fa-check-circle fa-3x text-success"></i>
                </div>
                <h4 className="mb20">Welcome, {userData.name || "User"}!</h4>
                <p className="mb30">
                  Your account has been created successfully. You can now access all features.
                </p>
                <div className="d-grid mb20">
                  <button className="ud-btn btn-thm" onClick={onClose}>
                    Continue to Dashboard <i className="fal fa-arrow-right-long"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationSuccessPopup;