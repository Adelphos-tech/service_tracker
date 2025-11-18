import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import EquipmentForm from './pages/EquipmentForm';
import EquipmentDetail from './pages/EquipmentDetail';
import QRScanner from './pages/QRScanner';
import PublicEquipmentView from './pages/PublicEquipmentView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Public QR Code Scan Route - Must be before private /equipment/:id */}
            <Route path="/equipment/scan/:id" element={<PublicEquipmentView />} />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <PrivateRoute>
                  <EquipmentList />
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment/new"
              element={
                <PrivateRoute>
                  <EquipmentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment/edit/:id"
              element={
                <PrivateRoute>
                  <EquipmentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment/:id"
              element={
                <PrivateRoute>
                  <EquipmentDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <PrivateRoute>
                  <QRScanner />
                </PrivateRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
