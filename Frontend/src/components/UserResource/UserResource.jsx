// filename: src/components/UserResource.jsx
import React, { useState, useEffect } from 'react';
import mandala from "../../assets/mandala.png";

const UserResource = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    capacity: '',
    location: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Sample resource data with professional image URLs and location codes
  const resources = [
    {
      id: 1,
      name: 'Lecture Hall A101',
      type: 'Lecture Hall',
      capacity: 60,
      location: 'A101',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-6pm',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Computer Lab B203',
      type: 'Lab',
      capacity: 30,
      location: 'B203',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 9am-5pm',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Meeting Room C305',
      type: 'Meeting Room',
      capacity: 12,
      location: 'B305',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-7pm',
      image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=500&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Projector X500',
      type: 'Equipment',
      capacity: 1,
      location: 'F1401',
      status: 'OUT_OF_SERVICE',
      availability: 'Pending Repair',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Conference Hall',
      type: 'Lecture Hall',
      capacity: 120,
      location: 'A201',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-6pm',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?w=500&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'DSLR Camera Kit',
      type: 'Equipment',
      capacity: 1,
      location: 'E301',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 9am-5pm',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Physics Lab D101',
      type: 'Lab',
      capacity: 40,
      location: 'B401',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-4pm',
      image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?w=500&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Smart Board Pro',
      type: 'Equipment',
      capacity: 1,
      location: 'F1305',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-6pm',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=500&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Lecture Hall A402',
      type: 'Lecture Hall',
      capacity: 80,
      location: 'A402',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-6pm',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Computer Lab B403',
      type: 'Lab',
      capacity: 45,
      location: 'B403',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 9am-5pm',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?w=500&h=300&fit=crop'
    }
  ];

  const typeOptions = ['All', 'Lecture Hall', 'Lab', 'Meeting Room', 'Equipment'];

  const getStatusStyle = (status) => {
    return status === 'ACTIVE'
      ? { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '30px', fontSize: '11px', fontWeight: '600', border: 'none', display: 'inline-block' }
      : { backgroundColor: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: '30px', fontSize: '11px', fontWeight: '600', border: 'none', display: 'inline-block' };
  };

  const getTypeBadgeStyle = (type) => {
    const colors = {
      'Lecture Hall': { 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff'
      },
      'Lab': { 
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        color: '#ffffff'
      },
      'Meeting Room': { 
        background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
        color: '#ffffff'
      },
      'Equipment': { 
        background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        color: '#ffffff'
      }
    };
    return { 
      padding: '4px 12px', 
      borderRadius: '20px', 
      fontSize: '11px', 
      fontWeight: '600', 
      display: 'inline-block',
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      ...colors[type] 
    };
  };

  const filteredResources = resources.filter(resource => {
    // Search filter - searches in name and location
    if (filters.search && !resource.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !resource.location.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter - if 'All' or empty, show all
    if (filters.type && filters.type !== 'All' && resource.type !== filters.type) {
      return false;
    }
    
    // Capacity filter - shows resources with capacity >= entered value
    if (filters.capacity && filters.capacity.trim() !== '') {
      const enteredCapacity = parseInt(filters.capacity);
      if (!isNaN(enteredCapacity)) {
        if (resource.capacity < enteredCapacity) {
          return false;
        }
      } else {
        // If not a number, try partial match
        const capStr = resource.capacity.toString();
        if (!capStr.includes(filters.capacity)) {
          return false;
        }
      }
    }
    
    // Location filter - text input search (searches by code like A101, B203)
    if (filters.location && filters.location.trim() !== '') {
      if (!resource.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  // Loading animation
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #1e293b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Loading resources...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      padding: '40px 32px'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        @keyframes rotateMandala {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: -0.2px;
          line-height: 1.4;
          margin: 0;
        }
        
        .detail-label {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .detail-value {
          font-size: 13px;
          font-weight: 500;
          color: #0f172a;
        }
        
        .availability-value {
          font-size: 12px;
          font-weight: 600;
          color: #b38b59;
          background: #fff4e8;
          padding: 3px 10px;
          borderRadius: 20px;
          display: inline-block;
        }
        
        .book-btn {
          background: #b38b59;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }
        
        .book-btn:hover:not(:disabled) {
          background: #9a784c;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(179, 139, 89, 0.3);
        }
        
        .book-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .disabled-btn {
          background: #f1f5f9;
          color: #94a3b8;
          border: 1px solid #e2e8f0;
          cursor: not-allowed;
        }
        
        .page-title {
          font-size: 42px;
          font-weight: 800;
          color: #6b6757;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
          text-align: center;
        }
        
        .header-wrapper {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .filter-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-family: inherit;
          background-color: #ffffff;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #b38b59;
          box-shadow: 0 0 0 3px rgba(179, 139, 89, 0.1);
        }
        
        .st-line {
          width: 40px;
          height: 2px;
          background: #6b6757;
          opacity: 0.6;
          border-radius: 2px;
        }
        
        .st-hero-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 20px 0 24px 0;
        }
        
        .st-mandala {
          display: inline-block;
          animation: rotateMandala 20s linear infinite;
        }
        
        .st-mandala img {
          width: 32px;
          height: 32px;
          opacity: 0.7;
        }
      `}</style>
      
      {/* Main Content */}
      <main style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Page Header - Centered Professional Design with Rotating Mandala */}
        <div className="header-wrapper" style={{ 
          animation: 'fadeInUp 0.5s ease-out'
        }}>
          <h1 className="page-title">
            Resource Catalogue
          </h1>
          
          {/* Decorative Divider with Rotating Mandala Image */}
          <div className="st-hero-divider">
            <span className="st-line"></span>
            <span className="st-mandala">
              <img src={mandala} alt="Mandala Ornament" />
            </span>
            <span className="st-line"></span>
          </div>
        </div>

        {/* Search & Filter Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
          border: '1px solid #eef2f6',
          animation: 'fadeInUp 0.5s ease-out 0.05s backwards'
        }}>
          
          {/* Search Row */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by resource name or location code (e.g., A101, B203)..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  fontSize: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  backgroundColor: '#fefefe'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#b38b59';
                  e.target.style.boxShadow = '0 0 0 3px rgba(179, 139, 89, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Filter Row - Type Dropdown + Capacity Input + Location Input */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Type Filter - Dropdown */}
            <div style={{ flex: '1', minWidth: '180px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
                Resource Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: '400',
                  color: '#1e293b'
                }}
              >
                {typeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter - Text Input with Greater Than Logic */}
            <div style={{ flex: '1', minWidth: '140px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
                Capacity (Min)
              </label>
              <input
                type="text"
                placeholder="Enter minimum capacity (e.g., 30)"
                value={filters.capacity}
                onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                className="filter-input"
              />
              {filters.capacity && !isNaN(parseInt(filters.capacity)) && (
                <p style={{ fontSize: '10px', color: '#b38b59', marginTop: '4px', marginLeft: '4px' }}>
                  Showing resources with capacity ≥ {parseInt(filters.capacity)}
                </p>
              )}
            </div>

            {/* Location Filter - Text Input for Location Codes */}
            <div style={{ flex: '1', minWidth: '180px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
                Location Code
              </label>
              <input
                type="text"
                placeholder="Type location code (e.g., A101, B203)"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="filter-input"
              />
            </div>
          </div>
        </div>

        {/* Results Stats */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'fadeInUp 0.5s ease-out 0.1s backwards'
        }}>
          <div style={{ 
            color: '#475569', 
            fontSize: '13px', 
            fontWeight: '500'
          }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{filteredResources.length}</span> resources available
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              padding: '5px 14px', 
              borderRadius: '30px', 
              border: '1px solid #e2e8f0', 
              backgroundColor: '#ffffff', 
              fontSize: '12px', 
              cursor: 'pointer', 
              fontWeight: '500',
              color: '#1e293b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}>
              Grid View
            </button>
            <button style={{ 
              padding: '5px 14px', 
              borderRadius: '30px', 
              border: '1px solid #e2e8f0', 
              backgroundColor: '#f8fafc', 
              fontSize: '12px', 
              cursor: 'pointer', 
              fontWeight: '500',
              color: '#64748b'
            }}>
              List View
            </button>
          </div>
        </div>

        {/* Resource Grid - Smaller Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #eef2f6',
                animation: `fadeInUp 0.5s ease-out ${0.15 + index * 0.03}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#eef2f6';
              }}
            >
              {/* Card Image - Smaller Height */}
              <div style={{
                height: '160px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9'
              }}>
                <img
                  src={resource.image}
                  alt={resource.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px'
                }}>
                  <span style={getStatusStyle(resource.status)}>{resource.status}</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px'
                }}>
                  <span style={getTypeBadgeStyle(resource.type)}>{resource.type}</span>
                </div>
              </div>
              
              {/* Card Content - Compact */}
              <div style={{ padding: '16px' }}>
                {/* Title - No Icon */}
                <h3 className="card-title" style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.2px',
                  lineHeight: '1.4'
                }}>
                  {resource.name}
                </h3>
                
                {/* Details - Compact Professional Design */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span className="detail-label">CAPACITY</span>
                    <span className="detail-value">{resource.capacity} {resource.type === 'Equipment' ? 'Unit' : 'People'}</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span className="detail-label">LOCATION</span>
                    <span className="detail-value">{resource.location}</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span className="detail-label">AVAILABILITY</span>
                    <span className="availability-value">{resource.availability}</span>
                  </div>
                </div>
                
                {/* Book Button - Professional Warm Brown Color */}
                <button
                  disabled={resource.status === 'OUT_OF_SERVICE'}
                  className={resource.status === 'OUT_OF_SERVICE' ? 'disabled-btn' : 'book-btn'}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: resource.status === 'OUT_OF_SERVICE' ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    ...(resource.status === 'OUT_OF_SERVICE' 
                      ? { background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }
                      : { background: '#b38b59', color: 'white', border: 'none' }
                    )
                  }}
                  onMouseEnter={(e) => {
                    if (resource.status !== 'OUT_OF_SERVICE') {
                      e.currentTarget.style.background = '#9a784c';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 139, 89, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (resource.status !== 'OUT_OF_SERVICE') {
                      e.currentTarget.style.background = '#b38b59';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {resource.status === 'OUT_OF_SERVICE' ? 'Not Available' : 'Book Now →'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 32px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            color: '#64748b',
            border: '1px solid #eef2f6',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🔍</span>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>No resources found</h3>
            <p style={{ fontSize: '13px' }}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserResource;