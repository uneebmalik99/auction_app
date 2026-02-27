import type { Vehicle, InvoiceStats } from './types';

export function getSalePrice(vehicle: Vehicle): number {
  return vehicle.buyNowEnabled && vehicle.buyNowPrice
    ? vehicle.buyNowPrice
    : vehicle.currentBid || vehicle.startingPrice;
}

export function calculateStats(vehicles: Vehicle[]): InvoiceStats {
  const totalInvoices = vehicles.length;
  const totalRevenue = vehicles.reduce((sum, v) => sum + getSalePrice(v), 0);
  const averageSale = totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

  return {
    totalInvoices,
    totalRevenue,
    averageSale,
  };
}

export function formatFeatures(features: { [key: string]: boolean }): string[] {
  return Object.entries(features || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
}

export function generateInvoiceNumber(vehicleId: string): string {
  return `INV-${vehicleId.slice(-8).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}
