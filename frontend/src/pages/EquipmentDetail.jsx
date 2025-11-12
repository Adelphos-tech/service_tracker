import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Printer,
  QrCode,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Wrench,
  AlertCircle,
  Plus
} from 'lucide-react';
import { formatDate, formatDateTime, getServiceStatus, getStatusColor, downloadQRCode, printQRCode } from '../utils/helpers';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    description: '',
    performedBy: '',
    cost: '',
    notes: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const { data } = await api.get(`/equipment/${id}`);
      setEquipment(data);
    } catch (error) {
      toast.error('Failed to load equipment');
      navigate('/equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/equipment/${id}`);
      toast.success('Equipment deleted successfully');
      navigate('/equipment');
    } catch (error) {
      toast.error('Failed to delete equipment');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...serviceForm };
      if (!submitData.performedBy) delete submitData.performedBy;
      if (!submitData.cost) delete submitData.cost;
      if (!submitData.notes) delete submitData.notes;

      await api.post(`/equipment/${id}/service`, submitData);
      toast.success('Service record added successfully');
      setShowServiceModal(false);
      setServiceForm({
        serviceDate: new Date().toISOString().split('T')[0],
        description: '',
        performedBy: '',
        cost: '',
        notes: ''
      });
      fetchEquipment();
    } catch (error) {
      toast.error('Failed to add service record');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!equipment) {
    return null;
  }

  const serviceStatus = getServiceStatus(equipment.serviceExpiryDate);
  const statusColor = getStatusColor(equipment.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/equipment')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Equipment
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{equipment.title}</h1>
              <p className="mt-2 text-gray-600">{equipment.model}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Link
                to={`/equipment/edit/${id}`}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger inline-flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
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
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span className={`badge badge-${statusColor === 'green' ? 'success' : statusColor === 'yellow' ? 'warning' : statusColor === 'red' ? 'danger' : 'gray'}`}>
                      {equipment.status}
                    </span>
                  </p>
                </div>
                {equipment.purchaseDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                    <p className="mt-1 text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(equipment.purchaseDate)}
                    </p>
                  </div>
                )}
                {equipment.purchasePrice && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purchase Price</p>
                    <p className="mt-1 text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      ${equipment.purchasePrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-gray-900">{equipment.description}</p>
              </div>
            </div>

            {/* Service Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Service & Maintenance</h2>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="btn-primary text-sm inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

              {/* Service History */}
              {equipment.serviceHistory && equipment.serviceHistory.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service History</h3>
                  <div className="space-y-4">
                    {equipment.serviceHistory.map((service, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{service.description}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(service.serviceDate)}
                              {service.performedBy && ` • Performed by: ${service.performedBy}`}
                            </p>
                            {service.notes && (
                              <p className="text-sm text-gray-600 mt-2">{service.notes}</p>
                            )}
                          </div>
                          {service.cost && (
                            <p className="text-sm font-medium text-gray-900 ml-4">
                              ${service.cost.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h2>
              <div className="flex justify-center mb-4">
                <img
                  src={equipment.qrCode}
                  alt="Equipment QR Code"
                  className="w-64 h-64 border-2 border-gray-200 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => downloadQRCode(equipment.qrCode, equipment.title)}
                  className="w-full btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download QR Code</span>
                </button>
                <button
                  onClick={() => printQRCode(equipment.qrCode, equipment)}
                  className="w-full btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print QR Code</span>
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center">
                Scan this QR code to quickly access equipment details
              </p>
            </div>

            {/* Quick Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h2>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Created: {formatDate(equipment.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Updated: {formatDate(equipment.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Equipment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this equipment? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Service Record</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={serviceForm.serviceDate}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Annual maintenance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performed By
                </label>
                <input
                  type="text"
                  value={serviceForm.performedBy}
                  onChange={(e) => setServiceForm({ ...serviceForm, performedBy: e.target.value })}
                  className="input-field"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost
                </label>
                <input
                  type="number"
                  value={serviceForm.cost}
                  onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={serviceForm.notes}
                  onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetail;
