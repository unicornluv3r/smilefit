const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) *
      Math.cos(lat2 * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return "< 1 km";
  return `${km.toFixed(1)} km`;
}

interface HasCoordinates {
  latitude: number;
  longitude: number;
}

interface CityLike extends HasCoordinates {
  name: string;
}

export function findNearestCity<T extends CityLike>(
  lat: number,
  lng: number,
  cities: T[],
): T & { distanceKm: number } {
  let nearest = cities[0];
  let minDist = haversineDistance(lat, lng, nearest.latitude, nearest.longitude);

  for (let i = 1; i < cities.length; i++) {
    const d = haversineDistance(lat, lng, cities[i].latitude, cities[i].longitude);
    if (d < minDist) {
      minDist = d;
      nearest = cities[i];
    }
  }

  return { ...nearest, distanceKm: minDist };
}

export function sortByDistance<T extends HasCoordinates>(
  lat: number,
  lng: number,
  items: T[],
): (T & { distanceKm: number })[] {
  return items
    .map((item) => ({
      ...item,
      distanceKm: haversineDistance(lat, lng, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
