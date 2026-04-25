import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { getResources } from '../../api/resourceApi';

export default function BookingForm() {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialResourceId = queryParams.get('resourceId') || '';

  const actualUserId = user?.userId || '';

  const [formData, setFormData] = useState({
    resourceId: initialResourceId,
    bookingDate: '',
    startTime: '',
    endTime: '',
    expectedAttendees: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const resourceMap = Object.fromEntries(resources.map(r => [r.id, r]));
  const hasPrefilledResource = Boolean(initialResourceId);
  const selectedResource = resourceMap[formData.resourceId];

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      resourceId: initialResourceId || current.resourceId,
    }));
  }, [initialResourceId]);

  const fetchMyBookings = async () => {
    try {
      const res = await axiosInstance.get(`/bookings?userId=${actualUserId}`);
      if (res.data.success) setMyBookings(res.data.data);
    } catch {
      // keep existing list
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await getResources();
        const list = Array.isArray(res) ? res : res?.data || [];
        setResources(list.filter(r => r.status !== 'OUT_OF_SERVICE'));
      } catch {
        setResources([]);
      }
    };
    fetchResources();
    fetchMyBookings();
  }, [actualUserId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Custom Validation: End time must be after start time
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      setMessage('error: End Time must be strictly after Start Time.');
      setLoading(false);
      return;
    }

    // Convert expectedAttendees string to actual number before sending
    const payload = {
        ...formData,
        userId: actualUserId,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees, 10) : null
    };
    
    try {
      const response = await axiosInstance.post('/bookings', payload);
      if (response.data.success) {
        setMessage('success: ' + response.data.message);
        setFormData({
          ...formData,
          resourceId: hasPrefilledResource ? initialResourceId : '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          expectedAttendees: '',
          purpose: '',
        });
        fetchMyBookings(); // Refresh the list instantly
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      setMessage('error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CANCELLED': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-8 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">
              Reserve a Resource
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Submit a new booking request for your project.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5 rounded-md shadow-sm">
              {hasPrefilledResource ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 ml-1 mb-1">Selected Resource</label>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm text-slate-800">
                    <div className="font-semibold">
                      {selectedResource?.name || `Resource #${formData.resourceId}`}
                    </div>
                    <div className="mt-1 text-slate-600">
                      {selectedResource
                        ? `${selectedResource.type} (${selectedResource.location})`
                        : "Loaded from the resource page selection"}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="resourceId" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Resource</label>
                  <select
                    id="resourceId"
                    name="resourceId"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={formData.resourceId}
                    onChange={handleChange}
                  >
                    <option value="">Select a resource…</option>
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.type} ({r.location})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Booking Date</label>
                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  required
                  min={today}
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  value={formData.bookingDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Start Time</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 ml-1 mb-1">End Time</label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="expectedAttendees" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Expected Attendees</label>
                <input
                  id="expectedAttendees"
                  name="expectedAttendees"
                  type="number"
                  min="1"
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="e.g. 15"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Purpose of Booking</label>
                <textarea
                  id="purpose"
                  name="purpose"
                  required
                  rows="3"
                  maxLength="200"
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none"
                  placeholder="e.g. Group meeting for PAF Assignment (max 200 chars)"
                  value={formData.purpose}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.startsWith('success') ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${message.startsWith('success') ? 'bg-teal-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${message.startsWith('success') ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </span>
                {message.replace('success: ', '').replace('error: ', '')}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: User's Bookings List */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[800px]">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              My Recent Bookings
            </h2>
            <p className="mt-2 text-sm text-slate-500 mb-6">
              Track the approval progress of your requests here.
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {loadingBookings ? (
               <div className="flex justify-center py-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
               </div>
            ) : myBookings.length === 0 ? (
               <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                 <div className="text-4xl mb-3">📅</div>
                 <h3 className="text-sm font-medium text-slate-900">No bookings yet</h3>
                 <p className="mt-1 text-xs text-slate-500">Fill out the form on the left to request a resource.</p>
               </div>
            ) : (
               myBookings.map((booking) => (
                 <div key={booking.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                          <h3 className="text-lg font-bold text-slate-800">{resourceMap[booking.resourceId]?.name || booking.resourceId}</h3>
                          <div className="text-xs text-slate-500 mt-1">{booking.purpose}</div>
                       </div>
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                         {booking.status}
                       </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-50">
                       <div>
                         <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</div>
                         <div className="text-sm font-medium text-slate-700">{booking.bookingDate || 'N/A'}</div>
                       </div>
                       <div>
                         <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Time</div>
                         <div className="text-sm font-medium text-slate-700">{booking.startTime || '?'} - {booking.endTime || '?'}</div>
                       </div>
                    </div>

                    {booking.rejectionReason && (
                       <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700">
                          <strong>Rejection Reason:</strong> {booking.rejectionReason}
                       </div>
                    )}
                 </div>
               ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
