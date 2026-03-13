import { useCallback, useState } from "react";

const SESSION_KEY = "smilefit_geo";

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

export function useGeolocation() {
  const supported = "geolocation" in navigator;

  const [state, setState] = useState<GeoState>(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      const { latitude, longitude } = JSON.parse(cached) as {
        latitude: number;
        longitude: number;
      };
      return { latitude, longitude, error: null, loading: false, supported };
    }
    return {
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
      supported,
    };
  });

  const requestPermission = useCallback(() => {
    if (!supported) {
      setState((s) => ({
        ...s,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ latitude, longitude }));
        setState({
          latitude,
          longitude,
          error: null,
          loading: false,
          supported: true,
        });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please enable it in your browser settings."
            : "Unable to determine your location. Please try again.";
        setState((s) => ({ ...s, error: message, loading: false }));
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [supported]);

  return { ...state, requestPermission };
}
