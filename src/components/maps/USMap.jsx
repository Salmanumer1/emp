import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

function USMap({ employees }) {

  // ── Most common states in HR datasets ──────────────────────
  const stateCoordinates = {
    Ohio:             [40.4173, -82.9071],
    Michigan:         [44.3148, -85.6024],
    Illinois:         [40.6331, -89.3985],
    Indiana:          [40.2672, -86.1349],
    Pennsylvania:     [41.2033, -77.1945],
    Wisconsin:        [43.7844, -88.7879],
    Kentucky:         [37.8393, -84.2700],
    Texas:            [31.9686, -99.9018],
    California:       [36.7783, -119.4179],
    Florida:          [27.6648, -81.5158],
    NewYork:          [43.0000, -75.0000],
    Georgia:          [32.1656, -82.9001],
    NorthCarolina:    [35.7596, -79.0193],
    Virginia:         [37.4316, -78.6569],
    Washington:       [47.7511, -120.7401],
    Tennessee:        [35.5175, -86.5804],
    Arizona:          [34.0489, -111.0937],
    Colorado:         [39.5501, -105.7821],
    NewJersey:        [40.0583, -74.4057],
    Minnesota:        [46.7296, -94.6859],
  };

  // ── Count employees per state from MySQL ───────────────────
  const stateCounts = {};
  employees.forEach((emp) => {
    const state = emp.location_state;
    if (!state) return;
    const normalized = state.replace(/\s+/g, ""); // "New York" → "NewYork"
    stateCounts[normalized] = (stateCounts[normalized] || 0) + 1;
  });

  // ── Combine counts + coordinates ───────────────────────────
  const mapData = Object.keys(stateCounts)
    .map((state) => ({
      state,
      count:    stateCounts[state],
      position: stateCoordinates[state],
    }))
    .filter((item) => item.position);

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      style={{ height: "600px", width: "100%", borderRadius: "20px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <CircleMarker center={[33.6844,73.0479]} pathOptions={{fillColor:   "#fd890d",
            color:       "#ffffff",
            fillOpacity: 0.7,
            weight:      2,}}></CircleMarker>
            <CircleMarker center={[33.6784,70.8567]} pathOptions={{fillColor:"red",color:"blue",weight:2}}></CircleMarker>
      {mapData.map((loc, index) => (
        <CircleMarker
          key={index}
          center={loc.position}
          radius={10 + loc.count / 15}
          pathOptions={{
            fillColor:   "#0d6efd",
            color:       "#ffffff",
            fillOpacity: 0.7,
            weight:      2,
          }}
        >
       
          <Popup>
            <div style={{ minWidth: 140 }}>
              <h6 className="mb-1">{loc.state}</h6>
              <p className="mb-0">👥 Employees: <strong>{loc.count}</strong></p>
            </div>
          </Popup>
        </CircleMarker>
        
      
      ))}
    
    </MapContainer>
  );
}

export default USMap;