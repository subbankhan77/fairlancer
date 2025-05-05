"use client";
import Link from "next/link";

export default function Breadcumb({ path }) {
  return (
    <>
      <section className="breadcumb-section">
        <div className="row">
          <div className="col-sm-8 col-lg-10">
            <div className="breadcumb-style1 mb10-xs">
              <div className="breadcumb-list">
                {path?.map((item, i) => (
                  <span key={i}>
                    <Link href={item.link}>{item.title}</Link>
                    {i < path.length - 1 && <span className="mx-1"></span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}