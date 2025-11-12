import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    model: '',
    serialNumber: '',
    description: '',
    category: 'Other',
    location: '',
    purchaseDate: '',
    purchasePrice: '',
    status: 'Active',
    serviceExpiryDate: '',
    calibrationExpiryDate: '',
    serviceInterval: '90'
  });

  const categories = [
    'Electronics',
    'Machinery',
    'Tools',
    'Vehicles',
    'IT Equipment',
    'Medical',
    'Laboratory',
    'Other'
  ];

  const statuses = ['Active', 'Inactive', 'Under Maintenance', 'Retired'];

  useEffect(() => {
    if (isEdit) {
      fetchEquipment();
    }
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const { data } = await api.get(`/equipment/${id}`);
      setFormData({
        title: data.title || '',
        model: data.model || '',
        serialNumber: data.serialNumber || '',
        description: data.description || '',
        category: data.category || 'Other',
        location: data.location || '',
        purchaseDate: data.purchaseDate ? data.purchaseDate.split('T')[0] : '',
        purchasePrice: data.purchasePrice || '',
        status: data.status || 'Active',
        serviceExpiryDate: data.serviceExpiryDate ? data.serviceExpiryDate.split('T')[0] : '',
        calibrationExpiryDate: data.calibrationExpiryDate ? data.calibrationExpiryDate.split('T')[0] : '',
        serviceInterval: data.serviceInterval || '90'
      });
    } catch (error) {
      toast.error('Failed to load equipment');
      navigate('/equipment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      
      // Convert empty strings to null for optional fields
      if (!submitData.serialNumber) delete submitData.serialNumber;
      if (!submitData.location) delete submitData.location;
      if (!submitData.purchaseDate) delete submitData.purchaseDate;
      if (!submitData.purchasePrice) delete submitData.purchasePrice;
      if (!submitData.serviceExpiryDate) delete submitData.serviceExpiryDate;
      if (!submitData.calibrationExpiryDate) delete submitData.calibrationExpiryDate;

      if (isEdit) {
        await api.put(`/equipment/${id}`, submitData);
        toast.success('Equipment updated successfully');
      } else {
        await api.post('/equipment', submitData);
        toast.success('Equipment added successfully');
      }
      navigate('/equipment');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/equipment')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Equipment
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Equipment' : 'Add New Equipment'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update equipment information' : 'Enter equipment details and generate QR code'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Laser Cutter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., LC-2000X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., SN123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Building A, Room 101"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Detailed description of the equipment..."
                />
              </div>
            </div>

            {/* Purchase Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service & Maintenance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Expiry Date
                  </label>
                  <input
                    type="date"
                    name="serviceExpiryDate"
                    value={formData.serviceExpiryDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email reminders will be sent 5-7 days before this date
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calibration Expiry Date
                  </label>
                  <input
                    type="date"
                    name="calibrationExpiryDate"
                    value={formData.calibrationExpiryDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interval (days)
                  </label>
                  <input
                    type="number"
                    name="serviceInterval"
                    value={formData.serviceInterval}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="90"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/equipment')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : isEdit ? 'Update Equipment' : 'Add Equipment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;
