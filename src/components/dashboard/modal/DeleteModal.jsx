// export default function DeleteModal() {
//   return (
//     <>
//       <div
//         className="modal fade"
//         id="deleteModal"
//         tabIndex={-1}
//         aria-labelledby="deleteModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content position-relative">
//             <button
//               type="button"
//               className="btn-close position-absolute"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//               style={{ top: "10px", right: "10px", zIndex: "9" }}
//             />
//             <div className="modal-body px-4 pt-5">
//               <div className="pb20">
//                 <h4 className="pb10 text-center text-black">
//                   Are you sure you want to delete?
//                 </h4>
//                 <p className="text-center">
//                   Do you really want to delete your these record ? This process
//                   can't be undo.
//                 </p>
//               </div>
//               <div className="d-flex justify-content-center gap-3 ">
//                 <a
//                   className="ud-btn bg-danger text-white mb25"
//                   data-bs-dismiss="modal"
//                   aria-label="Close"
//                 >
//                   Delete
//                   <i className="fal fa-arrow-right-long" />
//                 </a>
//                 <a
//                   className="ud-btn btn-dark mb25"
//                   data-bs-dismiss="modal"
//                   aria-label="Close"
//                 >
//                   Cancel
//                   <i className="fal fa-arrow-right-long" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Delete Confirmation"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="ud-btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="ud-btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}