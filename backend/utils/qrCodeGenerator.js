import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generateQRCode = async (equipmentId) => {
  try {
    // Generate unique identifier for QR code
    const qrData = `${process.env.FRONTEND_URL}/equipment/scan/${equipmentId}`;
    
    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      width: 300
    });

    return {
      qrCode: qrCodeDataURL,
      qrCodeData: qrData
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
