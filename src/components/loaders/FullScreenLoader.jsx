"use client";

import React from "react";

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-[9999]" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      zIndex: 9999
    }}>
      <div className="text-center p-5 rounded-lg">
        <div className="spinner-border text-thm mb-4" role="status" style={{ 
          width: "3rem", 
          height: "3rem",
          display: "inline-block",
          verticalAlign: "text-bottom",
          borderWidth: "0.25em",
          borderStyle: "solid",
          borderColor: "currentColor transparent currentColor transparent",
          borderRadius: "50%",
          animation: "spinner-border .75s linear infinite"
        }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-2 fw600 dark-color">{message}</h5>
      </div>
    </div>
  );
};

export default FullScreenLoader;