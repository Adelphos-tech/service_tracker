import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { QrCode, Camera, AlertCircle } from 'lucide-react';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = () => {
    setScanning(true);
    
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);
    
    // Stop scanning
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    setScanning(false);

    // Extract equipment ID from URL
    const urlPattern = /\/equipment\/scan\/([a-f0-9]+)/i;
    const match = decodedText.match(urlPattern);
    
    if (match && match[1]) {
      const equipmentId = match[1];
      navigate(`/equipment/${equipmentId}`);
    } else {
      toast.error('Invalid QR code. Please scan an equipment QR code.');
    }
  };

  const onScanError = (error) => {
    // Ignore common scanning errors
    if (!error.includes('NotFoundException')) {
      console.warn('QR scan error:', error);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 rounded-2xl">
              <QrCode className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Scan QR Code</h1>
          <p className="mt-2 text-gray-600">
            Scan equipment QR codes to quickly access their details
          </p>
        </div>

        {/* Scanner Card */}
        <div className="card">
          {!scanning ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Scan
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to start scanning QR codes
              </p>
              <button
                onClick={startScanning}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start Scanning</span>
              </button>
            </div>
          ) : (
            <div>
              <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
              <div className="mt-6 text-center">
                <button
                  onClick={stopScanning}
                  className="btn-secondary"
                >
                  Stop Scanning
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Scanning Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting conditions</li>
                <li>• Hold your device steady</li>
                <li>• Position the QR code within the scanning frame</li>
                <li>• Keep the QR code flat and unobstructed</li>
                <li>• Allow camera permissions when prompted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
