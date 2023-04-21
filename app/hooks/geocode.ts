import { createContext, useContext } from "react";

import type { Geocode } from "~/types";

export const GeocodeContext = createContext<{
  geocode: Geocode;
  setGeocode: (geocode: Geocode) => void;
}>({
  geocode: {},
  setGeocode: () => {},
});

export const useGeocode = () => useContext(GeocodeContext);
