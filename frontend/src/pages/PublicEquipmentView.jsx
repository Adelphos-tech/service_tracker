import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Wrench,
  QrCode,
  Building2,
  User,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { formatDate, getServiceStatus, getStatusColor } from '../utils/helpers';

const PublicEquipmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      // Use public scan endpoint - no authentication required
      const apiUrl = import.meta.env.VITE_API_URL || 'https://servicetracker-production.up.railway.app/api';
      const { data } = await axios.get(`${apiUrl}/equipment/scan/${id}`);
      setEquipment(data);
      setError(null);
    } catch (error) {
      console.error('Failed to load equipment:', error);
      setError('Equipment not found or QR code is invalid');
      toast.error('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600">Loading equipment details...</p>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The scanned QR code is invalid or the equipment no longer exists.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Login</span>
          </button>
        </div>
      </div>
    );
  }

  const serviceStatus = getServiceStatus(equipment.serviceExpiryDate);
  const statusColor = getStatusColor(equipment.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 rounded-2xl">
              <Package className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{equipment.title}</h1>
          <p className="mt-2 text-gray-600">{equipment.model}</p>
          <span className={`inline-flex mt-3 badge badge-${statusColor === 'green' ? 'success' : statusColor === 'yellow' ? 'warning' : statusColor === 'red' ? 'danger' : 'gray'}`}>
            {equipment.status}
          </span>
        </div>

        {/* Owner Information */}
        {equipment.user && (
          <div className="card mb-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-primary-600" />
              Owner Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {equipment.user.name && (
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{equipment.user.name}</span>
                </div>
              )}
              {equipment.user.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{equipment.user.email}</span>
                </div>
              )}
              {equipment.user.company && (
                <div className="flex items-center text-gray-700 sm:col-span-2">
                  <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{equipment.user.company}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Equipment Details */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Equipment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="mt-1 text-gray-900">{equipment.category}</p>
            </div>
            {equipment.serialNumber && (
              <div>
                <p className="text-sm font-medium text-gray-500">Serial Number</p>
                <p className="mt-1 text-gray-900">{equipment.serialNumber}</p>
              </div>
            )}
            {equipment.location && (
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1 text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {equipment.location}
                </p>
              </div>
            )}
            {equipment.purchaseDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                <p className="mt-1 text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(equipment.purchaseDate)}
                </p>
              </div>
            )}
          </div>
          {equipment.description && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
              <p className="text-gray-900">{equipment.description}</p>
            </div>
          )}
        </div>

        {/* Service Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-gray-600" />
            Service & Maintenance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.serviceExpiryDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Service Expiry Date</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-gray-900">{formatDate(equipment.serviceExpiryDate)}</p>
                  <span className={`badge badge-${serviceStatus.color === 'green' ? 'success' : serviceStatus.color === 'yellow' ? 'warning' : serviceStatus.color === 'red' ? 'danger' : 'info'}`}>
                    {serviceStatus.label}
                  </span>
                </div>
              </div>
            )}
            {equipment.calibrationExpiryDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Calibration Expiry</p>
                <p className="mt-1 text-gray-900">{formatDate(equipment.calibrationExpiryDate)}</p>
              </div>
            )}
            {equipment.lastServiceDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Last Service</p>
                <p className="mt-1 text-gray-900">{formatDate(equipment.lastServiceDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Service Interval</p>
              <p className="mt-1 text-gray-900">{equipment.serviceInterval} days</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card text-center bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <QrCode className="h-12 w-12 mx-auto mb-4 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want to manage your equipment?
          </h3>
          <p className="text-gray-600 mb-6">
            Sign in to access full equipment management features
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-secondary"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Equipment information viewed via QR code</p>
        </div>
      </div>
    </div>
  );
};

export default PublicEquipmentView;
