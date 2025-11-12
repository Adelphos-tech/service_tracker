import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Package, 
  AlertCircle, 
  Wrench, 
  CheckCircle, 
  Plus,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { formatDate, getServiceStatus } from '../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [upcomingService, setUpcomingService] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, equipmentRes] = await Promise.all([
        api.get('/equipment/stats/dashboard'),
        api.get('/equipment')
      ]);

      setStats(statsRes.data);
      
      // Get recent equipment (last 5)
      setRecentEquipment(equipmentRes.data.slice(0, 5));
      
      // Get equipment with upcoming service
      const upcoming = equipmentRes.data
        .filter(eq => eq.serviceExpiryDate)
        .sort((a, b) => new Date(a.serviceExpiryDate) - new Date(b.serviceExpiryDate))
        .slice(0, 5);
      setUpcomingService(upcoming);
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Equipment',
      value: stats?.totalEquipment || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active',
      value: stats?.activeEquipment || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Under Maintenance',
      value: stats?.underMaintenance || 0,
      icon: Wrench,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Service Due Soon',
      value: stats?.upcomingService || 0,
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your equipment.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`h-8 w-8 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/equipment/new"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-lg hover:from-primary-600 hover:to-secondary-700 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Equipment</span>
              </Link>
              <Link
                to="/equipment"
                className="flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all"
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">View All Equipment</span>
              </Link>
              <Link
                to="/scan"
                className="flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Scan QR Code</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Equipment */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Equipment</h2>
              <Link to="/equipment" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            {recentEquipment.length > 0 ? (
              <div className="space-y-3">
                {recentEquipment.map((equipment) => (
                  <Link
                    key={equipment._id}
                    to={`/equipment/${equipment._id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{equipment.title}</h3>
                        <p className="text-sm text-gray-600">{equipment.model}</p>
                      </div>
                      <span className={`badge badge-${getServiceStatus(equipment.serviceExpiryDate).color === 'green' ? 'success' : getServiceStatus(equipment.serviceExpiryDate).color === 'yellow' ? 'warning' : getServiceStatus(equipment.serviceExpiryDate).color === 'red' ? 'danger' : 'gray'}`}>
                        {equipment.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No equipment added yet</p>
                <Link to="/equipment/new" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
                  Add your first equipment
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Service */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Service</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            {upcomingService.length > 0 ? (
              <div className="space-y-3">
                {upcomingService.map((equipment) => {
                  const serviceStatus = getServiceStatus(equipment.serviceExpiryDate);
                  return (
                    <Link
                      key={equipment._id}
                      to={`/equipment/${equipment._id}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{equipment.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Due: {formatDate(equipment.serviceExpiryDate)}
                          </p>
                        </div>
                        <span className={`badge badge-${serviceStatus.color === 'green' ? 'success' : serviceStatus.color === 'yellow' ? 'warning' : serviceStatus.color === 'red' ? 'danger' : 'info'}`}>
                          {serviceStatus.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No upcoming service scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
