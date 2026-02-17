export type VinDecoded = {
  year?: number;
  make?: string;
  model?: string;
  fuelType?: string;
  driveType?: string;
  transmissionType?: string;
  bodyType?: string;
  engineCylinders?: string;
  engineCapacity?: string; // e.g. "1998cc" or "2.0L"
  horsePower?: number;
};

function cleanStr(value: any): string | undefined {
  if (typeof value !== 'string') return undefined;
  const s = value.trim();
  if (!s || s.toLowerCase() === 'not available') return undefined;
  return s;
}

function mapFuelType(raw?: string): string | undefined {
  const v = raw?.toLowerCase();
  if (!v) return undefined;
  if (v.includes('gasoline') || v.includes('petrol')) return 'Petrol';
  if (v.includes('diesel')) return 'Diesel';
  if (v.includes('electric')) return 'Electric';
  if (v.includes('hybrid')) return 'Hybrid';
  return undefined;
}

function mapTransmission(raw?: string): string | undefined {
  const v = raw?.toLowerCase();
  if (!v) return undefined;
  if (v.includes('auto')) return 'Automatic';
  if (v.includes('manual')) return 'Manual';
  if (v.includes('cvt')) return 'Automatic';
  return undefined;
}

function mapDriveType(raw?: string): string | undefined {
  const v = raw?.toLowerCase();
  if (!v) return undefined;
  if (v.includes('front')) return 'FWD';
  if (v.includes('rear')) return 'RWD';
  if (v.includes('all')) return 'AWD';
  if (v.includes('4')) return '4WD';
  return undefined;
}

/**
 * Decode VIN using NHTSA vPIC (no API key required).
 * Docs: https://vpic.nhtsa.dot.gov/api/
 */
export async function decodeVin(vin: string): Promise<VinDecoded> {
  const normalized = vin.trim().toUpperCase();
  if (normalized.length < 11) {
    throw new Error('VIN is too short.');
  }

  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(
    normalized,
  )}?format=json`;

  const res = await fetch(url, { method: 'GET' });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Unable to decode VIN right now.');
  }

  const row = Array.isArray(data?.Results) ? data.Results[0] : null;
  if (!row) {
    throw new Error('No VIN details found.');
  }

  const year = Number(row?.ModelYear);
  const decoded: VinDecoded = {
    year: Number.isFinite(year) ? year : undefined,
    make: cleanStr(row?.Make),
    model: cleanStr(row?.Model),
    bodyType: cleanStr(row?.BodyClass),
    fuelType: mapFuelType(cleanStr(row?.FuelTypePrimary)),
    driveType: mapDriveType(cleanStr(row?.DriveType)),
    transmissionType: mapTransmission(cleanStr(row?.TransmissionStyle)),
    engineCylinders: cleanStr(row?.EngineCylinders),
  };

  // Engine capacity (prefer CC, fallback to liters)
  const cc = cleanStr(row?.DisplacementCC);
  const liters = cleanStr(row?.DisplacementL);
  if (cc) decoded.engineCapacity = `${cc}cc`;
  else if (liters) decoded.engineCapacity = `${liters}L`;

  const hp = Number(row?.EngineHP);
  if (Number.isFinite(hp)) decoded.horsePower = hp;

  // If NHTSA indicates an invalid VIN, it often provides an error text.
  const errorText = cleanStr(row?.ErrorText);
  if (errorText && errorText.toLowerCase().includes('error')) {
    // don't hard-fail if we still got useful fields
    if (!decoded.make && !decoded.model && !decoded.year) {
      throw new Error(errorText);
    }
  }

  return decoded;
}

