export default function SidebarMenuSkeleton() {
    return (
      <>
        <div className="skeleton-line" style={{
          height: '20px',
          width: '80px',
          backgroundColor: '#eee',
          marginLeft: '30px',
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite'
        }} />
        
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="sidebar_list_item mb-1">
            <div className="items-center d-flex" style={{ padding: '12px 30px' }}>
              <div className="skeleton-circle" style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#eee',
                marginRight: '15px',
                animation: 'pulse 1.5s infinite'
              }} />
              <div className="skeleton-line" style={{
                height: '16px',
                width: '120px',
                backgroundColor: '#eee',
                animation: 'pulse 1.5s infinite'
              }} />
            </div>
          </div>
        ))}
      </>
    );
}