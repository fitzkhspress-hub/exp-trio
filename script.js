// Values based on the 2027 Yearbook Photographer Guide
const apertures = ["f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/22"];
const shutters = ["1/15", "1/30", "1/60", "1/125", "1/250", "1/500", "1/1000"];
const isos = ["100", "200", "400", "800", "1600", "3200", "6400"];

// DOM Elements
const apertureSlider = document.getElementById("aperture");
const shutterSlider = document.getElementById("shutter");
const isoSlider = document.getElementById("iso");
const sceneSelector = document.getElementById("scene");
const pointer = document.getElementById("pointer");
const meterStatus = document.getElementById("meter-status");

// Update functions
function calculateExposure() {
    const apIndex = parseInt(apertureSlider.value);
    const shIndex = parseInt(shutterSlider.value);
    const isoIndex = parseInt(isoSlider.value);
    const sceneTarget = parseInt(sceneSelector.value);

    // Calculate light points. 
    // Left side of array = more light for Aperture/Shutter, less light for ISO
    const apLight = 6 - apIndex; 
    const shLight = 6 - shIndex;
    const isoLight = isoIndex; 

    const totalLight = apLight + shLight + isoLight;
    
    // Calculate meter position (-3 to +3)
    let meterValue = totalLight - sceneTarget;
    
    // Clamp meter value between -3 and +3 for the UI
    if (meterValue > 3) meterValue = 3;
    if (meterValue < -3) meterValue = -3;

    updateUI(apIndex, shIndex, isoIndex, meterValue);
}

function updateUI(apIndex, shIndex, isoIndex, meterValue) {
    // Update numeric displays
    document.getElementById("aperture-val").innerText = apertures[apIndex];
    document.getElementById("shutter-val").innerText = shutters[shIndex];
    document.getElementById("iso-val").innerText = isos[isoIndex];

    // Update hints based on extremes from the guide
    document.getElementById("aperture-hint").innerText = 
        apIndex <= 1 ? "Small number: More light, blurry background" : 
        apIndex >= 5 ? "Big number: Less light, everything sharp" : "";

    document.getElementById("shutter-hint").innerText = 
        shIndex <= 1 ? "Slower: Blur - use a tripod below 1/60" : 
        shIndex >= 5 ? "Faster: Freezes people who move" : "";

    document.getElementById("iso-hint").innerText = 
        isoIndex <= 1 ? "Lower: Bright light, clean photo" : 
        isoIndex >= 5 ? "Higher: Dark rooms, more grain ('noise')" : "";

    // Update Meter Position (0 to 100% of the bar width)
    // -3 is 10%, 0 is 50%, +3 is 90%
    const positionPercentage = 50 + (meterValue * 13.33);
    pointer.style.left = `${positionPercentage}%`;

    // Update Meter Status Text
    if (meterValue < 0) {
        meterStatus.innerText = "TOO DARK - Underexposed";
        meterStatus.style.color = "#ef4444"; // Red
    } else if (meterValue > 0) {
        meterStatus.innerText = "TOO BRIGHT - Overexposed";
        meterStatus.style.color = "#ef4444"; // Red
    } else {
        meterStatus.innerText = "AIM FOR 0 - Correct Exposure";
        meterStatus.style.color = "#4ade80"; // Green
    }
}

// Event Listeners
apertureSlider.addEventListener("input", calculateExposure);
shutterSlider.addEventListener("input", calculateExposure);
isoSlider.addEventListener("input", calculateExposure);
sceneSelector.addEventListener("change", calculateExposure);

// Initial calculation on load
calculateExposure();