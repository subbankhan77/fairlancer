// import Image from "next/image";
// import Link from "next/link";

// export default function FreelancerCard1({ data }) {
//   console.log("FreelancerCard1",{data});
  
//   return (
//     <>
//       <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
//         <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
//           <Image
//             height={90}
//             width={90}
//             className="rounded-circle mx-auto"
//             src={data.img}
//             alt="thumb"
//           />
//           <span className="online" />
//         </div>
//         <div className="details">
//           <h5 className="title mb-1">{data.name}</h5>
//           <p className="mb-0">{data.profession}</p>
//           <div className="review">
//             <p>
//               <i className="fas fa-star fz10 review-color pr10" />
//               <span className="dark-color fw500">{data.rating}</span>(
//               {data.reviews} reviews)
//             </p>
//           </div>
//           <div className="skill-tags d-flex align-items-center justify-content-center mb5">
//             <span className="tag">Figma</span>
//             <span className="tag mx10">Sketch</span>
//             <span className="tag">HTML5</span>
//           </div>
//           <hr className="opacity-100 mt20 mb15" />
//           <div className="fl-meta d-flex align-items-center justify-content-between">
//             <a className="meta fw500 text-start">
//               Location
//               <br />
//               <span className="fz14 fw400">London</span>
//             </a>
//             <a className="meta fw500 text-start">
//               Rate
//               <br />
//               <span className="fz14 fw400">$90 / hr</span>
//             </a>
//             <a className="meta fw500 text-start">
//               Job Success
//               <br />
//               <span className="fz14 fw400">%98</span>
//             </a>
//           </div>
//           <div className="d-grid mt15">
//             <Link
//               href={`/freelancer-single/${data.id}`}
//               className="ud-btn btn-light-thm"
//             >
//               View Profile
//               <i className="fal fa-arrow-right-long" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// import Image from "next/image";
// import Link from "next/link";

// export default function FreelancerCard1({ data }) {
//   console.log("FreelancerCard1", data);
  
//   // Set default image if data.img is not available
//   const profileImage = data.img || "/images/default-profile.jpg";
  
//   return (
//     <div className="col-md-6 col-lg-4 mb30">
//       <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
//         <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
//           {/* Handle possible image errors */}
//           <Image
//             height={90}
//             width={90}
//             className="rounded-circle mx-auto"
//             src={profileImage}
//             alt="thumb"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = "/images/default-profile.jpg";
//             }}
//           />
//           <span className="online" />
//         </div>
//         <div className="details">
//           <h5 className="title mb-1">{data.name || data.title || "Untitled Project"}</h5>
//           <p className="mb-0">{data.profession || data.category || "Project"}</p>
//           <div className="review">
//             <p>
//               <i className="fas fa-star fz10 review-color pr10" />
//               <span className="dark-color fw500">{data.rating || "4.5"}</span>(
//               {data.reviews || "0"} reviews)
//             </p>
//           </div>
//           <div className="skill-tags d-flex align-items-center justify-content-center mb5">
//             {data.skills && Array.isArray(data.skills) && data.skills.length > 0 ? (
//               data.skills.slice(0, 3).map((skill, index) => (
//                 <span key={index} className={`tag ${index === 1 ? 'mx10' : ''}`}>{skill}</span>
//               ))
//             ) : (
//               <>
//                 <span className="tag">Figma</span>
//                 <span className="tag mx10">Sketch</span>
//                 <span className="tag">HTML5</span>
//               </>
//             )}
//           </div>
//           <hr className="opacity-100 mt20 mb15" />
//           <div className="fl-meta d-flex align-items-center justify-content-between">
//             <a className="meta fw500 text-start">
//               {data.budget ? "Budget" : "Location"}
//               <br />
//               <span className="fz14 fw400">{data.budget || data.location || "London"}</span>
//             </a>
//             <a className="meta fw500 text-start">
//               {data.status ? "Status" : "Rate"}
//               <br />
//               <span className="fz14 fw400">{data.status || data.rate || "$90 / hr"}</span>
//             </a>
//             <a className="meta fw500 text-start">
//               {data.proposals_count ? "Proposals" : "Job Success"}
//               <br />
//               <span className="fz14 fw400">{data.proposals_count || data.job_success || "%98"}</span>
//             </a>
//           </div>
//           <div className="d-grid mt15">
//             <Link
//               href={data.is_project ? `/project/${data.id}` : `/freelancer-single/${data.id}`}
//               className="ud-btn btn-light-thm"
//             >
//               {data.is_project ? "View Project" : "View Profile"}
//               <i className="fal fa-arrow-right-long" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import Image from "next/image";
import Link from "next/link";
import { useSelector } from 'react-redux';

export default function FreelancerCard1({ id }) {
  // Get all projects from Redux store
  const { projectsData } = useSelector((state) => state.projects);
  
  // Find the specific project by id
  const data = projectsData?.find(project => project.id === id) || {};
  
  // Set default image if data.img is not available
  const profileImage = data.img || "/images/default-profile.jpg";
  
  return (
    <div className="col-md-6 col-lg-4 mb30">
      <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
        <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
          {/* Handle possible image errors */}
          <Image
            height={90}
            width={90}
            className="rounded-circle mx-auto"
            src={profileImage}
            alt="thumb"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-profile.jpg";
            }}
          />
          <span className="online" />
        </div>
        <div className="details">
          <h5 className="title mb-1">{data.name || data.title || "Untitled Project"}</h5>
          <p className="mb-0">{data.profession || data.category || "Project"}</p>
          <div className="review">
            <p>
              <i className="fas fa-star fz10 review-color pr10" />
              <span className="dark-color fw500">{data.rating || "4.5"}</span>(
              {data.reviews || "0"} reviews)
            </p>
          </div>
          <div className="skill-tags d-flex align-items-center justify-content-center mb5">
            {data.skills && Array.isArray(data.skills) && data.skills.length > 0 ? (
              data.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className={`tag ${index === 1 ? 'mx10' : ''}`}>{skill}</span>
              ))
            ) : (
              <>
                <span className="tag">Figma</span>
                <span className="tag mx10">Sketch</span>
                <span className="tag">HTML5</span>
              </>
            )}
          </div>
          <hr className="opacity-100 mt20 mb15" />
          <div className="fl-meta d-flex align-items-center justify-content-between">
            <a className="meta fw500 text-start">
              {data.budget ? "Budget" : "Location"}
              <br />
              <span className="fz14 fw400">{data.budget || data.location || "London"}</span>
            </a>
            <a className="meta fw500 text-start">
              {data.status ? "Status" : "Rate"}
              <br />
              <span className="fz14 fw400">{data.status || data.rate || "$90 / hr"}</span>
            </a>
            <a className="meta fw500 text-start">
              {data.proposals_count ? "Proposals" : "Job Success"}
              <br />
              <span className="fz14 fw400">{data.proposals_count || data.job_success || "%98"}</span>
            </a>
          </div>
          <div className="d-grid mt15">
            <Link
              href={data.is_project ? `/project/${data.id}` : `/freelancer-single/${data.id}`}
              className="ud-btn btn-light-thm"
            >
              {data.is_project ? "View Project" : "View Profile"}
              <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}