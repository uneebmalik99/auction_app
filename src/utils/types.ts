import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Authentication: { initialTab?: AuthTab } | undefined;
  Home: undefined;
  ForgetPassword: undefined;
  AdminHome: undefined;
  Profile: undefined;
  EditProfile: undefined;
  HelpSupport: undefined;
  Faqs: undefined;
  CustomerHome: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  AddAuctionItem: undefined;
  AdminHomeTab: undefined;
  BrokerHomeTab: undefined;
  AdminAuctionItems: undefined;
  CustomerHomeTab: undefined;
  MyBids: undefined;
  Favorites: undefined;
  PrivacyPolicies: undefined;
  ChatScreen: { vehicleId: string; vehicleTitle: string };
  ItemDetails:
    | { auctionId: string; item?: AuctionItem; myBids?: boolean }
    | undefined;
  UserDetails: { user?: User | null; userId?: string | null };
  AdminUsers: undefined;
  AdminInvoices: undefined;
  BrokerChats: undefined;
  BrokerInvoices: undefined;
  BrokerAuctionItems: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Authentication'
>;

export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  favorites?: string[];
  profileImage?: string;
  phone?: string;
  address?: string;
}

// All fields used in the AddAuctionItem screen (form fields + selectors + features)
export interface AuctionItem {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number | string;
  vin: string;
  mileage: number | string;
  horsePower: number | string;
  engineCapacity: string;
  engineCylinder: string;
  noOfSeats: number | string;
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
  noOfKeys: number | string;
  location: string;
  startingPrice: number | string;
  minimumBidIncrement: number | string;
  biddingStartsAt?: Date | string;
  biddingEndsAt?: Date | string;
  description?: string;
  photos: string[];
  features: {
    adaptiveCruiseControl?: boolean;
    autoDimmingMirrors?: boolean;
    cruiseControl?: boolean;
    headsUpDisplay?: boolean;
    navigationSystem?: boolean;
    parkingSensors?: boolean;
    reversingCamera?: boolean;
    steeringWheelControls?: boolean;
    automatedParking?: boolean;
    birdsEyeViewCamera?: boolean;
    digitalDisplay?: boolean;
    digitalDisplayMirrors?: boolean;
    paddleShifters?: boolean;
    wirelessCharging?: boolean;
    bluetooth?: boolean;
    appleCarPlay?: boolean;
    androidAuto?: boolean;
    premiumSoundSystem?: boolean;
    rearEntertainmentScreen?: boolean;
    sunroof?: boolean;
    keylessEntry?: boolean;
    leatherSeats?: boolean;
    lumberSupport?: boolean;
    memorySeats?: boolean;
    powerfoldingMirrors?: boolean;
    powerSeats?: boolean;
    pushStart?: boolean;
    ambientLighting?: boolean;
    electricRunningBoard?: boolean;
    handsFreeLiftGate?: boolean;
    heatedCooledSeats?: boolean;
    messageSeats?: boolean;
    remoteStart?: boolean;
    softCloseDoors?: boolean;
    blindSpotMonitor?: boolean;
    brakeAssist?: boolean;
    fogLights?: boolean;
    laneKeepAssist?: boolean;
    ledHeadlights?: boolean;
    colloisionWarningSystem?: boolean;
  };
  status: 'upcoming' | 'live' | 'sold' | 'pending';
  currentBid?: number | string;
  createdAt: string;
  updatedAt: string;
  // ID of the seller / creator of this item (as returned by backend)
  sellerId?: string | number;

  firstOwner: boolean;

  sellerNationality: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  type?: 'info' | 'warning' | 'bid' | 'auction_end' | 'system'; // optional
  data?: Record<string, any>; // e.g., auctionId, bidId, etc.
}

export interface TabItem {
  key: string;
  label: string;
}

export type AuthTab = 'signIn' | 'signUp';

export type MyBidsTab = 'active' | 'purchased';

export type AuctionItemsTab = 'active' | 'upcoming' | 'pending' | 'sold';

export interface FeatureOption {
  id: string;
  label: string;
}
