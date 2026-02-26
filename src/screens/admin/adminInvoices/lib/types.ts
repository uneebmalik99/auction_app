export interface Vehicle {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  horsePower: number;
  engineCapacity: string;
  engineCylinder: string;
  noOfSeats: number;
  warranty: boolean;
  serviceHistory: boolean;
  rimSize: string;
  fuelType: string;
  driveType: string;
  roofType: string;
  bodyType: string;
  transmissionType: string;
  color: string;
  registrationCity: string;
  noOfKeys: number;
  location: string;
  startingPrice: number;
  minimumBidIncrement: number;
  currentBid?: number;
  buyNowPrice?: number;
  buyNowEnabled?: boolean;
  winnerName?: string;
  winnerEmail?: string;
  winnerId?: string;
  winnerPhone?: string;
  status: 'hot' | 'active' | 'ending' | 'live' | 'upcoming' | 'sold' | 'pending';
  updatedAt: string;
  createdAt: string;
  photos: string[];
  features: {
    [key: string]: boolean;
  };
}

export interface BuyerInfo {
  winnerName: string;
  winnerEmail: string;
  winnerPhone: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  averageSale: number;
}
