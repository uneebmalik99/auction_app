import { FeatureOption } from './types';

export const authTabs = [
  { key: 'signIn', label: 'Sign In' },
  { key: 'signUp', label: 'Sign Up' },
];

export const myBidsTabs = [
  { key: 'active', label: 'Active bids' },
  { key: 'purchased', label: 'Purchased' },
];

export const auctionItemsTabs = [
  { key: 'active', label: 'Active' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
  { key: 'sold', label: 'Sold' },
];

export const featureOptions: FeatureOption[] = [
  { id: 'adaptiveCruiseControl', label: 'Adaptive Cruise Control' },
  { id: 'autoDimmingMirrors', label: 'Auto Dimming Mirrors' },
  { id: 'cruiseControl', label: 'Cruise Control' },
  { id: 'headsUpDisplay', label: 'Heads Up Display' },
  { id: 'navigationSystem', label: 'Navigation System' },
  { id: 'parkingSensors', label: 'Parking Sensors' },
  { id: 'reversingCamera', label: 'Reversing Camera' },
  { id: 'steeringWheelControls', label: 'Steering Wheel Controls' },
  { id: 'automatedParking', label: 'Automated Parking' },
  { id: 'birdsEyeViewCamera', label: 'Birds Eye View Camera' },
  { id: 'digitalDisplay', label: 'Digital Display' },
  { id: 'digitalDisplayMirrors', label: 'Digital Display Mirrors' },
  { id: 'paddleShifters', label: 'Paddle Shifters' },
  { id: 'wirelessCharging', label: 'Wireless charging' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'appleCarPlay', label: 'Apple CarPlay' },
  { id: 'androidAuto', label: 'Android Auto' },
  { id: 'premiumSoundSystem', label: 'Premium Sound System' },
  { id: 'rearEntertainmentScreen', label: 'Rear Entertainment Screen' },
  { id: 'sunroof', label: 'Sunroof' },
  { id: 'keylessEntry', label: 'Keyless Entry' },
  { id: 'leatherSeats', label: 'Leather Seats' },
  { id: 'lumberSupport', label: 'Lumber Support' },
  { id: 'memorySeats', label: 'Memory Seats' },
  { id: 'powerfoldingMirrors', label: 'Powerfolding Mirrors' },
  { id: 'powerSeats', label: 'Power Seats' },
  { id: 'pushStart', label: 'Push Start' },
  { id: 'ambientLighting', label: 'Ambient Lighting' },
  { id: 'electricRunningBoard', label: 'Electric Running Board' },
  { id: 'handsFreeLiftGate', label: 'Hands Free Lift Gate' },
  { id: 'heatedCooledSeats', label: 'Heated/Cooled Seats' },
  { id: 'messageSeats', label: 'Message Seats' },
  { id: 'remoteStart', label: 'Remote Start' },
  { id: 'softCloseDoors', label: 'Soft Close Doors' },
  { id: 'blindSpotMonitor', label: 'Blind Spot Monitor' },
  { id: 'brakeAssist', label: 'Brake Assist' },
  { id: 'fogLights', label: 'Fog Lights' },
  { id: 'laneKeepAssist', label: 'Lane Keep Assist' },
  { id: 'ledHeadlights', label: 'LED Headlights' },
  { id: 'colloisionWarningSystem', label: 'Collision Warning System' },
];

export const driveEaseOptions: FeatureOption[] = [
  { id: 'adaptiveCruiseControl', label: 'Adaptive Cruise Control' },
  { id: 'autoDimmingMirrors', label: 'Auto Dimming Mirrors' },
  { id: 'cruiseControl', label: 'Cruise Control' },
  { id: 'headsupDisplay', label: 'Heads Up Display' },
  { id: 'navigationSystem', label: 'Navigation System' },
  { id: 'parkingSensors', label: 'Parking Sensors' },
  { id: 'reversingCamera', label: 'Reversing Camera' },
  { id: 'steeringWheelControls', label: 'Steering Wheel Controls' },
  { id: 'automatedParking', label: 'Automated Parking' },
  { id: 'birdsEyeViewCamera', label: 'Birds Eye View Camera' },
  { id: 'digitalDisplay', label: 'Digital Display' },
  { id: 'digitalDisplayMirrors', label: 'Digital Display Mirrors' },
  { id: 'paddleShifters', label: 'Paddle Shifters' },
];

export const entertainmentOptions: FeatureOption[] = [
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'appleCarPlay/androidAuto', label: 'Apple CarPlay/Android Auto' },
  { id: 'premiumSoundSystem', label: 'Premium Sound System' },
  { id: 'rearEntertainmentScreen', label: 'Rear Entertainment Screen' },
];

export const comfortAndConvenienceOptions: FeatureOption[] = [
  { id: 'keylessEntry', label: 'Keyless Entry' },
  { id: 'leatherSeats', label: 'Leather Seats' },
  { id: 'lumberSupport', label: 'Lumber Support' },
  { id: 'memorySeats', label: 'Memory Seats' },
  { id: 'powerfoldingMirrors', label: 'Powerfolding Mirrors' },
  { id: 'powerSeats', label: 'Power Seats' },
  { id: 'pushStartButton', label: 'Push Start Button' },
  { id: 'ambientLighting', label: 'Ambient Lighting' },
  { id: 'electricRunningBoard', label: 'Electric Running Board' },
  { id: 'handsFreeLiftGate', label: 'Hands Free Lift Gate' },
  { id: 'heated-cooledSeats', label: 'Heated/Cooled Seats' },
  { id: 'messageSeats', label: 'Message Seats' },
  { id: 'remoteStart', label: 'Remote Start' },
  { id: 'softCloseDoors', label: 'Soft Close Doors' },
];

export const safetyOptions: FeatureOption[] = [
  { id: 'blindSpotMonitor', label: 'Blind Spot Monitor' },
  { id: 'brakeAssist', label: 'Brake Assist' },
  { id: 'fogLights', label: 'Fog Lights' },
  { id: 'laneKeepAssist', label: 'Lane Keep Assist' },
  { id: 'LEDHeadlights', label: 'LED Headlights' },
  { id: 'coloisionWarningSyatem', label: 'Coloision Warning Syatem' },
];

export const bodyTypeOptions: FeatureOption[] = [
  { id: 'Sedan', label: 'Sedan' },
  { id: 'SUV', label: 'SUV' },
  { id: 'Hatchback', label: 'Hatchback' },
  { id: 'MPV', label: 'MPV' },
  { id: 'Coupe', label: 'Coupe' },
  { id: 'Convertible', label: 'Convertible' },
  { id: 'Roadster', label: 'Roadster' },
];

export const roofTypeOptions: FeatureOption[] = [
  { id: 'Panoramic', label: 'Panoramic' },
  { id: 'Normal', label: 'Normal' },
];

export const transmissionTypeOptions: FeatureOption[] = [
  { id: 'Automatic', label: 'Automatic' },
  { id: 'Manual', label: 'Manual' },
  { id: 'Hybrid', label: 'Hybrid' },
];

export const fuelTypeOptions: FeatureOption[] = [
  { id: 'Petrol', label: 'Petrol' },
  { id: 'Diesel', label: 'Diesel' },
  { id: 'Electric', label: 'Electric' },
  { id: 'Hybrid', label: 'Hybrid' },
];

export const driveTypeOptions: FeatureOption[] = [
  { id: 'FWD', label: 'FWD' },
  { id: 'RWD', label: 'RWD' },
  { id: 'AWD', label: 'AWD' },
  { id: '4WD', label: '4WD' },
];
