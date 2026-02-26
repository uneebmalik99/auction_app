import type { Vehicle } from './types';
import { getSalePrice, generateInvoiceNumber, formatFeatures } from './utils';
import { generateInvoiceHTML } from './invoiceTemplate';

export function generateInvoiceHTMLForView(vehicle: Vehicle): string {
  const saleDate = new Date(vehicle.updatedAt || vehicle.createdAt);
  const invoiceNumber = generateInvoiceNumber(vehicle._id);
  const salePrice = getSalePrice(vehicle);
  const features = formatFeatures(vehicle.features || {});

  return generateInvoiceHTML(vehicle, invoiceNumber, saleDate, salePrice, features);
}
