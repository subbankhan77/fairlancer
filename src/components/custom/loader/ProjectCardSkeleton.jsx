export default function ProjectCardSkeleton() {
    return (
      <div className="col-md-12 mb20">
        <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
          <div className="col-lg-8 ps-0">
            <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
              <div className="thumb w60 position-relative rounded-circle mb15-md">
                <div className="skeleton-circle" style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#eee',
                  animation: 'pulse 1.5s infinite'
                }} />
              </div>
              <div className="details ml15 ml0-md mb15-md">
                <div className="skeleton-line" style={{
                  height: '24px',
                  width: '70%',
                  backgroundColor: '#eee',
                  marginBottom: '15px',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div className="skeleton-line" style={{
                  height: '16px',
                  width: '40%',
                  backgroundColor: '#eee',
                  marginBottom: '10px',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div className="skeleton-line" style={{
                  height: '16px',
                  width: '30%',
                  backgroundColor: '#eee',
                  marginBottom: '15px',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div className="skeleton-line" style={{
                  height: '60px',
                  width: '100%',
                  backgroundColor: '#eee',
                  marginBottom: '15px',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div className="d-flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-tag" style={{
                      height: '24px',
                      width: '80px',
                      backgroundColor: '#eee',
                      borderRadius: '12px',
                      animation: 'pulse 1.5s infinite'
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
            <div className="details">
              <div className="text-lg-end">
                <div className="skeleton-line" style={{
                  height: '20px',
                  width: '60%',
                  backgroundColor: '#eee',
                  marginLeft: 'auto',
                  marginBottom: '10px',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div className="skeleton-line" style={{
                  height: '20px',
                  width: '40%',
                  backgroundColor: '#eee',
                  marginLeft: 'auto',
                  marginBottom: '15px',
                  animation: 'pulse 1.5s infinite'
                }} />
              </div>
              <div className="d-grid mt15">
                <div className="skeleton-button" style={{
                  height: '48px',
                  width: '100%',
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  animation: 'pulse 1.5s infinite'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }