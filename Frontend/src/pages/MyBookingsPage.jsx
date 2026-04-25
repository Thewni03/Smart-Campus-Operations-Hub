import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const actualUserId = user?.userId || 'user123';

  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const res = await axiosInstance.get(`/bookings?userId=${actualUserId}`);
      if (res.data.success) {
        setMyBookings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [actualUserId]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              My Booking History
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and track all your past and pending resource reservations.
            </p>
          </div>
          
          <div className="space-y-4">
            {loadingBookings ? (
               <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
               </div>
            ) : myBookings.length === 0 ? (
               <div className="text-center py-20 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                 <div className="text-5xl mb-4">📅</div>
                 <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
                 <p className="mt-1 text-sm text-slate-500">You haven't requested any resources yet.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {myBookings.map((booking) => (
                   <div key={booking.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className="text-xl font-bold text-slate-800">{booking.resourceId}</h3>
                            <div className="text-sm text-slate-500 mt-1">{booking.purpose}</div>
                         </div>
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getStatusBadge(booking.status)}`}>
                           {booking.status}
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100">
                         <div>
                           <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</div>
                           <div className="text-base font-medium text-slate-700">{booking.bookingDate || 'N/A'}</div>
                         </div>
                         <div>
                           <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Time</div>
                           <div className="text-base font-medium text-slate-700">{booking.startTime || '?'} - {booking.endTime || '?'}</div>
                         </div>
                      </div>

                      {booking.rejectionReason && (
                         <div className="mt-5 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-800">
                            <strong>Reason for Rejection:</strong> {booking.rejectionReason}
                         </div>
                      )}
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
