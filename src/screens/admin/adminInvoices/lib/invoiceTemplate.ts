import type { Vehicle } from './types';

export function generateInvoiceHTML(
  vehicle: Vehicle,
  invoiceNumber: string,
  saleDate: Date,
  salePrice: number,
  features: string[],
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${vehicle.title}</title>
  <style>
    @page { margin: 0.5in; size: letter; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: #1f2937;
      background: #ffffff;
      padding: 50px;
      line-height: 1.6;
    }
    .invoice-container { max-width: 900px; margin: 0 auto; background: white; }
    .invoice-header {
      background: #f1f5f9;
      color: #334155;
      padding: 40px;
      border-radius: 12px 12px 0 0;
      margin-bottom: 0;
      border-bottom: 2px solid #cbd5e1;
    }
    .invoice-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .invoice-header h1 {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -1px;
      color: #0f172a;
    }
    .invoice-header .company {
      font-size: 16px;
      color: #475569;
      margin-bottom: 4px;
    }
    .invoice-number-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: right;
      min-width: 200px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .invoice-number-box p {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .invoice-number-box .value {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    .invoice-info {
      background: #f8fafc;
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #e5e7eb;
    }
    .buyer-section h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b7280;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .buyer-info {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .buyer-info p {
      color: #111827;
      margin-bottom: 6px;
      font-size: 15px;
    }
    .buyer-info p:first-child {
      font-weight: 700;
      font-size: 16px;
    }
    .invoice-date-box { text-align: right; }
    .invoice-date-box p {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .invoice-date-box .value {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    .section {
      margin-bottom: 35px;
      padding: 0 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #94a3b8;
      display: inline-block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border-radius: 8px;
      overflow: hidden;
    }
    table thead { background: #f1f5f9; color: #334155; }
    table th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table td {
      padding: 14px 16px;
      font-size: 14px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }
    table tbody tr:hover { background-color: #f9fafb; }
    table tbody tr:last-child td { border-bottom: none; }
    .label-cell {
      font-weight: 600;
      color: #4b5563;
      width: 40%;
    }
    .value-cell { color: #111827; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 15px;
    }
    .feature-item {
      background: #eff6ff;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13px;
      color: #1e40af;
      font-weight: 500;
      border: 1px solid #bfdbfe;
    }
    .pricing-section {
      background: #f0f9ff;
      padding: 30px 40px;
      border-radius: 12px;
      margin: 30px 40px;
      border: 1px solid #bae6fd;
    }
    .pricing-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .pricing-table td { padding: 16px 20px; font-size: 15px; }
    .pricing-table tr.total-row {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      font-size: 18px;
    }
    .pricing-table tr.total-row td {
      color: #0f172a;
      border: none;
    }
    .footer {
      margin-top: 50px;
      padding: 30px 40px;
      background: #f9fafb;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      border-radius: 0 0 12px 12px;
    }
    .footer p {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.8;
    }
    @media print {
      body { padding: 20px; }
      .invoice-header { border-radius: 0; }
      .footer { border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="invoice-header-content">
        <div>
          <h1>INVOICE</h1>
          <div class="company">Vehicle Auctions</div>
          <div class="company">Professional Vehicle Sales</div>
        </div>
        <div class="invoice-number-box">
          <p>Invoice Number</p>
          <p class="value">${invoiceNumber}</p>
          <p style="margin-top: 15px;">Invoice Date</p>
          <p class="value">${saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </div>

    <div class="invoice-info">
      <div class="buyer-section">
        <h2>Bill To</h2>
        <div class="buyer-info">
          ${vehicle.winnerName ? `
            <p>${vehicle.winnerName}</p>
            ${vehicle.winnerEmail ? `<p style="color: #6b7280; font-size: 14px;">${vehicle.winnerEmail}</p>` : ''}
            ${vehicle.winnerPhone ? `<p style="color: #6b7280; font-size: 14px; margin-top: 8px;">📞 ${vehicle.winnerPhone}</p>` : ''}
          ` : '<p style="color: #9ca3af;">Buyer information not available</p>'}
        </div>
      </div>
      <div class="invoice-date-box">
        <p>Sale Date</p>
        <p class="value">${saleDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Vehicle Details</h2>
      <table>
        <thead>
          <tr>
            <th>Specification</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="label-cell">Vehicle Title</td><td class="value-cell">${vehicle.title}</td></tr>
          <tr><td class="label-cell">Make / Model</td><td class="value-cell">${vehicle.make} ${vehicle.model}</td></tr>
          <tr><td class="label-cell">Year</td><td class="value-cell">${vehicle.year}</td></tr>
          <tr><td class="label-cell">VIN Number</td><td class="value-cell" style="font-family: 'Courier New', monospace; font-weight: 600;">${vehicle.vin}</td></tr>
          <tr><td class="label-cell">Mileage</td><td class="value-cell">${vehicle.mileage.toLocaleString()} km</td></tr>
          <tr><td class="label-cell">Color</td><td class="value-cell">${vehicle.color || '—'}</td></tr>
          <tr><td class="label-cell">Fuel Type</td><td class="value-cell">${vehicle.fuelType}</td></tr>
          <tr><td class="label-cell">Transmission</td><td class="value-cell">${vehicle.transmissionType}</td></tr>
          <tr><td class="label-cell">Body Type</td><td class="value-cell">${vehicle.bodyType}</td></tr>
          <tr><td class="label-cell">Engine Capacity</td><td class="value-cell">${vehicle.engineCapacity} • ${vehicle.engineCylinder} cylinders</td></tr>
          <tr><td class="label-cell">Horse Power</td><td class="value-cell">${vehicle.horsePower} HP</td></tr>
          <tr><td class="label-cell">Drive Type</td><td class="value-cell">${vehicle.driveType}</td></tr>
          <tr><td class="label-cell">Number of Seats</td><td class="value-cell">${vehicle.noOfSeats}</td></tr>
          <tr><td class="label-cell">Registration City</td><td class="value-cell">${vehicle.registrationCity}</td></tr>
          <tr><td class="label-cell">Location</td><td class="value-cell">${vehicle.location || '—'}</td></tr>
          <tr><td class="label-cell">Number of Keys</td><td class="value-cell">${vehicle.noOfKeys}</td></tr>
          <tr><td class="label-cell">Warranty</td><td class="value-cell">${vehicle.warranty ? '<span style="color: #059669; font-weight: 600;">Yes</span>' : '<span style="color: #dc2626;">No</span>'}</td></tr>
          <tr><td class="label-cell">Service History</td><td class="value-cell">${vehicle.serviceHistory ? '<span style="color: #059669; font-weight: 600;">Yes</span>' : '<span style="color: #dc2626;">No</span>'}</td></tr>
        </tbody>
      </table>
    </div>

    ${features.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Vehicle Features</h2>
      <div class="features-grid">
        ${features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="pricing-section">
      <h2 class="section-title" style="margin-left: 0; margin-bottom: 20px;">Payment Summary</h2>
      <table class="pricing-table">
        <tbody>
          <tr>
            <td class="label-cell">Sale Price</td>
            <td class="value-cell" style="text-align: right; font-weight: 600; font-size: 16px;">$${salePrice.toLocaleString()}</td>
          </tr>
          ${vehicle.buyNowEnabled ? `
          <tr>
            <td class="label-cell">Purchase Type</td>
            <td class="value-cell" style="text-align: right;">
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 12px;">BUY NOW</span>
            </td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td>Total Amount Due</td>
            <td style="text-align: right; font-weight: bold;">$${salePrice.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #374151; margin-bottom: 8px;">Official Invoice Document</p>
      <p>This is an official invoice for the vehicle purchase. Please keep this document for your records.</p>
      <p style="margin-top: 12px; font-size: 11px; color: #9ca3af;">Invoice generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  </div>
</body>
</html>
  `;
}
