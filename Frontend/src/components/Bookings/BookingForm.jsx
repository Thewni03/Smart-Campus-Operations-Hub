import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    resourceId: '',
    userId: 'user123', // Admin/Sys will track real ID later
    bookingDate: '',
    startTime: '',
    endTime: '',
    expectedAttendees: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Convert expectedAttendees string to actual number before sending
    const payload = {
        ...formData,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees, 10) : null
    };
    
    try {
      const response = await axios.post('/api/bookings', payload);
      if (response.data.success) {
        setMessage('success: ' + response.data.message);
        setFormData({ ...formData, resourceId: '', bookingDate: '', startTime: '', endTime: '', expectedAttendees: '', purpose: '' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      setMessage('error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
            Reserve a Resource
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Smart Campus Operations Hub
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 rounded-md shadow-sm">
            <div>
              <label htmlFor="resourceId" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Resource ID</label>
              <input
                id="resourceId"
                name="resourceId"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="e.g. ROOM-101"
                value={formData.resourceId}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Booking Date</label>
              <input
                id="bookingDate"
                name="bookingDate"
                type="date"
                required
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Purpose of Booking</label>
              <textarea
                id="purpose"
                name="purpose"
                required
                rows="3"
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none"
                placeholder="e.g. Group meeting for PAF Assignment"
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
    </div>
  );
}
