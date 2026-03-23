import L from 'leaflet';

export const DEFAULT_CENTER = [-8.65, 115.2167];

export const MAP_THEMES = {
  standard: {
    name: "Standard (OSM)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap'
  },
  dark: {
    name: "Gelap (Dark Mode)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; CartoDB'
  },
  satellite: {
    name: "Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri'
  }
};

export const CUSTOM_ICON = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});