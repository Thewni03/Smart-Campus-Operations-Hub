import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/bookings/${id}/status?status=${newStatus}`);
      if (res.data.success) {
        fetchBookings();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending booking?")) return;
    try {
      const res = await axios.delete(`/api/bookings/${id}`);
      if (res.data.success) {
        fetchBookings();
      }
    } catch (error) {
       alert(error.response?.data?.message || 'Error deleting booking');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bookings Management</h1>
            <p className="mt-2 text-sm text-slate-600">
              A list of all resource booking requests including their status, time, and purpose.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={fetchBookings}
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-colors duration-200"
            >
              Refresh Data
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-2xl bg-white">
                <table className="min-w-full divide-y divide-slate-300">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Resource ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">User ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Time Window</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-3 py-8 text-center text-sm text-slate-500 italic">No bookings found.</td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                            {booking.resourceId}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{booking.userId}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                            <div>{new Date(booking.startTime).toLocaleString()}</div>
                            <div className="text-slate-400 text-xs mt-0.5">to {new Date(booking.endTime).toLocaleString()}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex gap-2 justify-end">
                            {booking.status === 'PENDING' && (
                              <>
                                <button onClick={() => updateStatus(booking.id, 'APPROVED')} className="text-emerald-600 hover:text-emerald-900">Approve</button>
                                <button onClick={() => updateStatus(booking.id, 'REJECTED')} className="text-rose-600 hover:text-rose-900">Reject</button>
                                <button onClick={() => deleteBooking(booking.id)} className="text-slate-400 hover:text-slate-600">Delete</button>
                              </>
                            )}
                            {booking.status === 'APPROVED' && (
                                <button onClick={() => updateStatus(booking.id, 'CANCELLED')} className="text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2 hover:bg-slate-100">Cancel Booking</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
