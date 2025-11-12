import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const getTimeUntil = (date) => {
  if (!date) return null;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  return differenceInDays(new Date(date), new Date());
};

export const getServiceStatus = (serviceExpiryDate) => {
  if (!serviceExpiryDate) return { status: 'none', label: 'No Service Date', color: 'gray' };
  
  const daysUntil = getDaysUntil(serviceExpiryDate);
  
  if (daysUntil < 0) {
    return { status: 'overdue', label: 'Overdue', color: 'red' };
  } else if (daysUntil <= 7) {
    return { status: 'urgent', label: 'Due Soon', color: 'yellow' };
  } else if (daysUntil <= 30) {
    return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
  } else {
    return { status: 'ok', label: 'OK', color: 'green' };
  }
};

export const getStatusColor = (status) => {
  const colors = {
    'Active': 'green',
    'Inactive': 'gray',
    'Under Maintenance': 'yellow',
    'Retired': 'red'
  };
  return colors[status] || 'gray';
};

export const downloadQRCode = (qrCode, equipmentTitle) => {
  const link = document.createElement('a');
  link.href = qrCode;
  link.download = `QR_${equipmentTitle.replace(/\s+/g, '_')}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printQRCode = (qrCode, equipment) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print QR Code - ${equipment.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .container {
          text-align: center;
          border: 2px solid #333;
          padding: 30px;
          border-radius: 10px;
        }
        h1 { margin: 0 0 10px 0; font-size: 24px; }
        .subtitle { color: #666; margin-bottom: 20px; }
        img { max-width: 300px; }
        .info { margin-top: 20px; font-size: 14px; }
        @media print {
          body { padding: 0; }
          .container { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${equipment.title}</h1>
        <div class="subtitle">${equipment.model}</div>
        <img src="${qrCode}" alt="QR Code" />
        <div class="info">
          ${equipment.serialNumber ? `<p><strong>Serial:</strong> ${equipment.serialNumber}</p>` : ''}
          ${equipment.location ? `<p><strong>Location:</strong> ${equipment.location}</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
