// filename: src/components/AdminResource.jsx
import React, { useState, useEffect } from 'react';
import mandala from "../../assets/mandala.png";

const AdminResource = () => {
  const [resources, setResources] = useState([
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
      location: 'C305',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-7pm',
      image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=500&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Projector X500',
      type: 'Equipment',
      capacity: 1,
      location: 'AV01',
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
      location: 'MED01',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 9am-5pm',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Physics Lab D101',
      type: 'Lab',
      capacity: 40,
      location: 'D101',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-4pm',
      image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?w=500&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Smart Board Pro',
      type: 'Equipment',
      capacity: 1,
      location: 'B105',
      status: 'ACTIVE',
      availability: 'Mon-Fri, 8am-6pm',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=500&h=300&fit=crop'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    status: '',
    capacity: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availability: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const typeOptions = ['Lecture Hall', 'Lab', 'Meeting Room', 'Equipment'];
  const locationOptions = ['A101', 'A201', 'B105', 'B203', 'C305', 'D101', 'AV01', 'MED01'];
  const statusOptions = ['ACTIVE', 'OUT_OF_SERVICE'];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Dashboard statistics
  const totalResources = resources.length;
  const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
  const outOfServiceResources = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

  // Filter resources
  const filteredResources = resources.filter(resource => {
    if (filters.search && !resource.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type && resource.type !== filters.type) {
      return false;
    }
    if (filters.location && resource.location !== filters.location) {
      return false;
    }
    if (filters.status && resource.status !== filters.status) {
      return false;
    }
    if (filters.capacity) {
      const enteredCapacity = parseInt(filters.capacity);
      if (!isNaN(enteredCapacity)) {
        if (resource.capacity < enteredCapacity) {
          return false;
        }
      }
    }
    return true;
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Resource name is required';
    if (!formData.type) errors.type = 'Resource type is required';
    if (!formData.capacity) errors.capacity = 'Capacity is required';
    else if (isNaN(formData.capacity) || formData.capacity <= 0) errors.capacity = 'Capacity must be a positive number';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.availability) errors.availability = 'Availability window is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new resource
  const handleAddResource = () => {
    if (!validateForm()) return;
    
    const newResource = {
      id: Math.max(...resources.map(r => r.id), 0) + 1,
      ...formData,
      capacity: parseInt(formData.capacity),
      image: formData.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=300&fit=crop'
    };
    setResources([...resources, newResource]);
    setShowAddModal(false);
    resetForm();
  };

  // Edit resource
  const handleEditResource = () => {
    if (!validateForm()) return;
    
    const updatedResources = resources.map(r => 
      r.id === selectedResource.id 
        ? { ...r, ...formData, capacity: parseInt(formData.capacity) }
        : r
    );
    setResources(updatedResources);
    setShowEditModal(false);
    resetForm();
  };

  // Delete resource
  const handleDeleteResource = () => {
    const updatedResources = resources.filter(r => r.id !== selectedResource.id);
    setResources(updatedResources);
    setShowDeleteConfirm(false);
    setSelectedResource(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      location: '',
      status: 'ACTIVE',
      availability: '',
      image: ''
    });
    setFormErrors({});
  };

  // Open edit modal with resource data
  const openEditModal = (resource) => {
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity.toString(),
      location: resource.location,
      status: resource.status,
      availability: resource.availability,
      image: resource.image
    });
    setShowEditModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (resource) => {
    setSelectedResource(resource);
    setShowDeleteConfirm(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      location: '',
      status: '',
      capacity: ''
    });
  };

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

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(0,0,0,0.1)',
            borderTop: '3px solid #2e7d32',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ color: '#2e7d32', fontSize: '14px', fontWeight: '500' }}>Loading resources...</p>
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
      backgroundColor: '#FAFAFA',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      padding: '40px 32px'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        
        @keyframes rotateMandala {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 28px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 0 3px rgba(46,125,50,0.1);
        }
        .error-text {
          color: #ef4444;
          font-size: 11px;
          margin-top: 4px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary {
          background: white;
          color: #475569;
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #f8fafc; }
        .btn-danger {
          background: #ef4444;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-danger:hover { background: #dc2626; }
        
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .filter-select {
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          background: white;
        }
        
        .table-container {
          background: white;
          border-radius: 20px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        
        th {
          text-align: left;
          padding: 16px 20px;
          background: #fafafa;
          font-weight: 600;
          font-size: 13px;
          color: #2e7d32;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #eef2f6;
        }
        
        td {
          padding: 14px 20px;
          font-size: 14px;
          color: #1e293b;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        tr:hover {
          background: #fafafa;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
        }
        
        .status-active {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .status-out {
          background: #ffebee;
          color: #c62828;
        }
        
        .type-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
          color: white;
        }
        
        .action-btn {
          padding: 6px 14px;
          margin: 0 4px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .edit-btn {
          background: #e3f2fd;
          color: #1565c0;
        }
        
        .edit-btn:hover {
          background: #bbdef5;
        }
        
        .delete-btn {
          background: #ffebee;
          color: #c62828;
        }
        
        .delete-btn:hover {
          background: #ffcdd2;
        }
        
        .availability-text {
          font-size: 12px;
          font-weight: 500;
          color: #2e7d32;
          background: #e8f5e9;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
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
      `}</style>

      <main style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Header with Decorative Divider */}
        <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
            Resource Management
          </h1>
          <p style={{ color: '#2e7d32', fontSize: '15px', fontWeight: '500' }}>
            
          </p>
          
          {/* Decorative Divider with Rotating Mandala Image */}
          <div className="st-hero-divider">
            <span className="st-line"></span>
            <span className="st-mandala">
              <img src={mandala} alt="Mandala Ornament" />
            </span>
            <span className="st-line"></span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="stat-card">
            <p style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '8px', fontWeight: '600' }}>Total Resources</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{totalResources}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '8px', fontWeight: '600' }}>Active Resources</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{activeResources}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '8px', fontWeight: '600' }}>Out of Service</p>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{outOfServiceResources}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Resource
          </button>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', width: '200px', background: 'white' }}
            />
            <select className="filter-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option value="">All Types</option>
              {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="filter-select" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}>
              <option value="">All Locations</option>
              {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="filter-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>
            <input
              type="text"
              placeholder="Min Capacity"
              value={filters.capacity}
              onChange={(e) => setFilters({...filters, capacity: e.target.value})}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', width: '100px', background: 'white' }}
            />
            <button className="btn-secondary" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>

        {/* Resources Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <td style={{ fontWeight: '500' }}>{resource.id}</td>
                  <td style={{ fontWeight: '500' }}>{resource.name}</td>
                  <td>
                    <span className="type-badge" style={getTypeBadgeStyle(resource.type)}>
                      {resource.type}
                    </span>
                  </td>
                  <td>{resource.capacity} {resource.type === 'Equipment' ? 'unit' : 'people'}</td>
                  <td>{resource.location}</td>
                  <td>
                    <span className={`status-badge ${resource.status === 'ACTIVE' ? 'status-active' : 'status-out'}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td>
                    <span className="availability-text">{resource.availability}</span>
                  </td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => openEditModal(resource)}>
                      ✎ Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => openDeleteConfirm(resource)}>
                      ✕ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
              No resources found
            </div>
          )}
        </div>

        {/* Add Resource Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Add New Resource</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Name *</label>
                  <input className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  {formErrors.name && <p className="error-text">{formErrors.name}</p>}</div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Type *</label>
                  <select className="form-input" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="">Select Type</option>
                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {formErrors.type && <p className="error-text">{formErrors.type}</p>}</div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Capacity *</label>
                  <input type="number" className="form-input" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                  {formErrors.capacity && <p className="error-text">{formErrors.capacity}</p>}</div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Location *</label>
                  <select className="form-input" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}>
                    <option value="">Select Location</option>
                    {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {formErrors.location && <p className="error-text">{formErrors.location}</p>}</div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Status</label>
                  <select className="form-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Availability Window *</label>
                  <input className="form-input" placeholder="e.g., Mon-Fri, 8am-6pm" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} />
                  {formErrors.availability && <p className="error-text">{formErrors.availability}</p>}</div>
                <div><label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Image URL (optional)</label>
                  <input className="form-input" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="btn-secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                <button className="btn-primary" onClick={handleAddResource}>Add Resource</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Resource Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => { setShowEditModal(false); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Edit Resource</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label>Name *</label><input className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  {formErrors.name && <p className="error-text">{formErrors.name}</p>}</div>
                <div><label>Type *</label><select className="form-input" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="">Select Type</option>{typeOptions.map(t => <option key={t} value={t}>{t}</option>)}</select>
                  {formErrors.type && <p className="error-text">{formErrors.type}</p>}</div>
                <div><label>Capacity *</label><input type="number" className="form-input" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                  {formErrors.capacity && <p className="error-text">{formErrors.capacity}</p>}</div>
                <div><label>Location *</label><select className="form-input" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}>
                  <option value="">Select Location</option>{locationOptions.map(l => <option key={l} value={l}>{l}</option>)}</select>
                  {formErrors.location && <p className="error-text">{formErrors.location}</p>}</div>
                <div><label>Status</label><select className="form-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label>Availability Window *</label><input className="form-input" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} />
                  {formErrors.availability && <p className="error-text">{formErrors.availability}</p>}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</button>
                <button className="btn-primary" onClick={handleEditResource}>Update Resource</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Confirm Delete</h2>
              <p style={{ color: '#475569', marginBottom: '24px' }}>
                Are you sure you want to delete <strong>{selectedResource?.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDeleteResource}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminResource;