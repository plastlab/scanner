import React from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  CreditCard,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { User, Fine } from '../types';

interface FinesProps {
  user: User;
  fines: Fine[];
}

export const Fines: React.FC<FinesProps> = ({ user, fines }) => {
  const userFines = fines.filter(fine => fine.userId === user.id);
  const unpaidFines = userFines.filter(fine => !fine.paid);
  const paidFines = userFines.filter(fine => fine.paid);

  const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

  const getStatusColor = (fine: Fine) => {
    if (fine.paid) return 'text-green-600 bg-green-50 border-green-200';
    if (new Date() > fine.dueDate) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getStatusIcon = (fine: Fine) => {
    if (fine.paid) return CheckCircle;
    if (new Date() > fine.dueDate) return XCircle;
    return Clock;
  };

  const getStatusText = (fine: Fine) => {
    if (fine.paid) return 'Paid';
    if (new Date() > fine.dueDate) return 'Overdue';
    return 'Pending';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Fines & Penalties</h1>
        <p className="text-gray-600">Manage your plastic disposal fines</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{unpaidFines.length}</p>
              <p className="text-sm text-gray-600">Unpaid Fines</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUnpaid} kr</p>
              <p className="text-sm text-gray-600">Total Owed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fine Reduction Info */}
      {user.points > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Fine Reduction Available</h3>
              <p className="text-sm text-emerald-800 mt-1">
                With {user.points} points, you're eligible for reduced fines. 
                Good behavior pays off!
              </p>
              <p className="text-xs text-emerald-700 mt-2">
                Higher points = lower fines for accidental violations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unpaid Fines */}
      {unpaidFines.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Unpaid Fines</h2>
          <div className="space-y-3">
            {unpaidFines.map((fine) => {
              const StatusIcon = getStatusIcon(fine);
              const statusColor = getStatusColor(fine);
              const statusText = getStatusText(fine);
              
              return (
                <div key={fine.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${statusColor}`}>
                            <div className="flex items-center space-x-1">
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusText}</span>
                            </div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900">Plastic Litter Violation</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{fine.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Found: {fine.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Due: {fine.dueDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{fine.amount} kr</p>
                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">You have no unpaid fines. Keep up the good work!</p>
        </div>
      )}

      {/* Fines History */}
      {paidFines.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <div className="space-y-3">
            {paidFines.map((fine) => (
              <div key={fine.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Plastic Litter Violation</h3>
                    <p className="text-sm text-gray-600">{fine.location}</p>
                    <p className="text-xs text-gray-500">
                      {fine.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{fine.amount} kr</p>
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};