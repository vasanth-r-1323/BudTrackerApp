// Initialize the map (using Leaflet.js)
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

// DOM Elements
const deviceNameEl = document.getElementById('device-name');
const timestampEl = document.getElementById('timestamp');
const latValEl = document.getElementById('lat-val');
const lonValEl = document.getElementById('lon-val');
const btnRefresh = document.getElementById('btn-refresh');
const btnNavigate = document.getElementById('btn-navigate');
const btnConnect = document.getElementById('btn-connect');
const statusIndicator = document.getElementById('bt-status');

// 1. REAL BLUETOOTH API
btnConnect.addEventListener('click', async () => {
    try {
        statusIndicator.innerText = "Scanning...";
        statusIndicator.style.backgroundColor = "#fff3e0"; 
        statusIndicator.style.color = "#e65100";

        // Request Bluetooth Device 
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        });

        deviceNameEl.innerText = device.name || "Unnamed Earbuds";
        statusIndicator.innerText = "Connected";
        statusIndicator.style.backgroundColor = "#e8f5e9";
        statusIndicator.style.color = "#2e7d32";
        
        // Once connected, grab the GPS location
        getRealLocation();

    } catch (error) {
        console.error("Bluetooth error:", error);
        statusIndicator.innerText = "Connection Failed";
        statusIndicator.style.backgroundColor = "#ffebee";
        statusIndicator.style.color = "#c62828";
    }
});

// 2. REAL GPS LOCATION API
function getRealLocation() {
    btnRefresh.innerText = "Locating...";

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        btnRefresh.innerText = "Get GPS";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Update UI text
            latValEl.innerText = lat.toFixed(5);
            lonValEl.innerText = lon.toFixed(5);
            
            const date = new Date();
            timestampEl.innerText = `Last seen: ${date.toLocaleTimeString()}`;

            // Update Map
            const coords = [lat, lon];
            if (marker) {
                marker.setLatLng(coords);
            } else {
                marker = L.marker(coords).addTo(map);
            }
            map.setView(coords, 16);
            
            btnRefresh.innerText = "Get GPS";
        },
        (error) => {
            console.error("GPS error:", error);
            alert("Unable to retrieve your location. Please check browser permissions.");
            btnRefresh.innerText = "Get GPS";
        },
        { enableHighAccuracy: true } 
    );
}

// Button Listeners
btnRefresh.addEventListener('click', getRealLocation);

btnNavigate.addEventListener('click', () => {
    const lat = latValEl.innerText;
    const lon = lonValEl.innerText;
    
    if (lat === "--" || lon === "--") {
        alert("No location data available yet!");
        return;
    }
    
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
});