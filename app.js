// --- Intro Scroll Reveal Logic ---
function initIntroReveal() {
    const introScreen = document.getElementById('intro-screen');
    if (!introScreen) return;

    const container = document.getElementById('scroll-reveal-container');
    const textEl = container.querySelector('.scroll-reveal-text');
    const text = textEl.textContent;
    const indicator = document.getElementById('scroll-indicator');

    // Split text into individual word spans for GSAP animation
    textEl.innerHTML = '';
    text.split(/(\s+)/).forEach(word => {
        if (word.match(/^\s+$/)) {
            textEl.appendChild(document.createTextNode(word));
            return;
        }
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        textEl.appendChild(span);
    });

    const wordElements = container.querySelectorAll('.word');

    // Animate words in on load
    gsap.fromTo(
        wordElements,
        { opacity: 0, filter: 'blur(12px)', y: 20 },
        { ease: 'power2.out', opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.1, duration: 1, delay: 0.2 }
    );

    // --- Scroll detection via wheel + touch events on document ---
    // This is the most reliable approach: no scrollable div needed.
    // We capture scroll intent and animate manually.
    const SCROLL_NEEDED = 500; // total px of scroll to complete the transition
    let accumulated = 0;
    let done = false;

    function applyProgress(delta) {
        if (done) return;
        accumulated = Math.min(SCROLL_NEEDED, accumulated + Math.max(0, delta));
        const progress = accumulated / SCROLL_NEEDED;

        // Fade + lift title as scroll progresses
        container.style.opacity = Math.max(0, 1 - progress * 2.5);
        container.style.transform = `translateY(${-progress * 120}px)`;

        // Hide scroll indicator after slight scroll
        if (progress > 0.05) indicator.style.opacity = '0';

        // At 80% scroll, fade out intro and show main app
        if (progress >= 0.8) {
            done = true;
            introScreen.style.transition = 'opacity 0.5s ease-in-out, visibility 0.5s';
            introScreen.style.opacity = '0';
            introScreen.style.visibility = 'hidden';
            document.removeEventListener('wheel', onWheel);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchstart', onTouchStart);
        }
    }

    // Mouse wheel / trackpad
    function onWheel(e) {
        e.preventDefault();
        applyProgress(e.deltaY);
    }

    // Touch (mobile)
    let touchStartY = 0;
    function onTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
        e.preventDefault();
        const delta = touchStartY - e.touches[0].clientY;
        touchStartY = e.touches[0].clientY;
        applyProgress(delta);
    }

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
}

// Mock Data if localStorage is empty
const defaultReports = [
    {
        id: "1",
        type: "Fire",
        description: "Large brush fire spreading quickly near the highway.",
        latitude: 28.6139,
        longitude: 77.2090,
        address: "New Delhi, India",
        severity: "Critical",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
    },
    {
        id: "2",
        type: "Flood",
        description: "Heavy rains caused the river to overflow.",
        latitude: 19.0760,
        longitude: 72.8777,
        address: "Mumbai, India",
        severity: "High",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
    }
];

// --- Safety Guide Data ---
// General public safety guidance per disaster type. Keys must match the
// values used in the "Disaster Type" <select> in the report form.
const safetyGuide = {
    Fire: {
        summary: "What to do before, during, and after a fire emergency.",
        before: [
            "Install smoke detectors on every floor and test them monthly.",
            "Keep a fire extinguisher accessible and know how to use it.",
            "Plan and practice two ways out of every room.",
            "Avoid overloading electrical outlets or power strips."
        ],
        during: [
            "Get low and stay low — smoke rises, cleaner air is near the floor.",
            "Leave the building immediately; do not stop to collect belongings.",
            "Never use elevators during a fire — use the stairs.",
            "Close doors behind you as you leave to slow the spread.",
            "Once outside, call your local fire emergency number right away."
        ],
        after: [
            "Don't re-enter the building until officials confirm it's safe.",
            "Watch for structural damage, hot spots, and weakened floors.",
            "Document damage with photos for insurance purposes.",
            "Contact local relief services if you need temporary shelter."
        ]
    },
    Flood: {
        summary: "Staying safe before, during, and after rising water.",
        before: [
            "Know whether your area is flood-prone and identify higher ground nearby.",
            "Prepare an emergency kit with water, food, flashlight, and documents.",
            "Move valuables and important documents to higher shelves.",
            "Sign up for local flood alerts if available."
        ],
        during: [
            "Move to higher ground immediately — don't wait for water to rise further.",
            "Never walk or drive through flowing flood water, even if it looks shallow.",
            "Avoid contact with electrical equipment if you are wet or standing in water.",
            "Turn off electricity and gas at the main switch if instructed by authorities."
        ],
        after: [
            "Avoid flood water — it can be contaminated with sewage or chemicals.",
            "Wait for officials to declare tap water safe before drinking it.",
            "Inspect your home for structural damage before re-entering.",
            "Photograph damage for insurance claims before cleanup begins."
        ]
    },
    Theft: {
        summary: "Reducing risk and responding safely to a theft or break-in.",
        before: [
            "Keep doors and windows locked, even when briefly stepping out.",
            "Install visible security measures like cameras, alarms, or good lighting.",
            "Avoid displaying valuables where they're visible from outside.",
            "Get to know your neighbors — they can help spot something unusual."
        ],
        during: [
            "Your safety matters more than any possession — don't confront an intruder.",
            "If you encounter someone, back away quietly and call for help.",
            "Move to a safe, lockable room if you're home during a break-in.",
            "Call the police as soon as it's safe to do so."
        ],
        after: [
            "File a police report as soon as possible, with as much detail as you can.",
            "Document missing items with photos, receipts, or serial numbers.",
            "Change locks and any shared codes or keys that may be compromised.",
            "Notify your bank if cards, cheques, or financial documents were taken."
        ]
    },
    Bomb: {
        summary: "General public guidance for a suspicious item or bomb threat.",
        before: [
            "Be alert to unattended bags or packages in public places.",
            "Know the evacuation routes for buildings you frequent.",
            "Report anything that seems out of place to security or police."
        ],
        during: [
            "Do not touch, move, or open a suspicious item.",
            "Calmly move away from the area and encourage others to do the same.",
            "Avoid using mobile phones or radios close to the suspicious item.",
            "Alert security or call the police immediately and follow their instructions.",
            "Follow evacuation routes — don't use elevators."
        ],
        after: [
            "Stay clear of the area until officials confirm it's safe.",
            "Follow updates and instructions from emergency responders.",
            "Share anything you noticed with authorities — details help investigations."
        ]
    },
    Earthquake: {
        summary: "Protecting yourself before, during, and after ground shaking.",
        before: [
            "Secure heavy furniture, shelves, and appliances to walls.",
            "Identify safe spots in each room, like under a sturdy table.",
            "Keep an emergency kit with water, food, and a first-aid kit ready.",
            "Know how to shut off gas, water, and electricity at the source."
        ],
        during: [
            "Drop, cover, and hold on — get under sturdy furniture if possible.",
            "Stay away from windows, mirrors, and tall furniture that could fall.",
            "If outdoors, move to an open area away from buildings and power lines.",
            "If driving, pull over to a clear spot and stay inside the vehicle."
        ],
        after: [
            "Check yourself and others for injuries and provide first aid if needed.",
            "Expect aftershocks and be ready to drop, cover, and hold on again.",
            "Check for gas leaks, damaged wiring, and structural cracks before re-entering.",
            "Avoid damaged buildings and bridges until inspected by officials."
        ]
    },
    Accident: {
        summary: "Responding safely to a road or general accident.",
        before: [
            "Follow traffic rules and avoid distractions while driving.",
            "Keep a basic first-aid kit and emergency contacts in your vehicle.",
            "Ensure regular vehicle maintenance, especially brakes and tires."
        ],
        during: [
            "Move to a safe area away from traffic if you're able to.",
            "Turn on hazard lights to warn other vehicles.",
            "Call emergency services immediately and describe the situation clearly.",
            "Don't move seriously injured people unless they're in immediate danger.",
            "Apply basic first aid only if you're trained to do so."
        ],
        after: [
            "Exchange information with other parties involved, if applicable.",
            "Document the scene with photos for insurance and reports.",
            "Seek medical attention even for injuries that seem minor at first.",
            "File a police report where required."
        ]
    },
    Other: {
        summary: "General preparedness guidance for unlisted or unusual incidents.",
        before: [
            "Stay informed about risks specific to your local area.",
            "Prepare a basic emergency kit with essentials and important documents.",
            "Save local emergency contact numbers in your phone."
        ],
        during: [
            "Stay calm and follow instructions from local authorities.",
            "Prioritize your safety and the safety of others over belongings.",
            "Move away from the immediate danger area if there is one.",
            "Call your local emergency number for guidance."
        ],
        after: [
            "Check on neighbors, especially those who may need extra help.",
            "Report any damage or ongoing hazards to local authorities.",
            "Follow official guidance on recovery and next steps."
        ]
    }
};

const safetyDisasterOrder = ['Fire', 'Flood', 'Theft', 'Bomb', 'Earthquake', 'Accident', 'Other'];

// Initialize State from LocalStorage
let reports = JSON.parse(localStorage.getItem('disaster_reports')) || defaultReports;
let map;
let currentLocation = null;
let activeSafetyType = 'Fire';

// DOM Elements
const modal = document.getElementById('report-modal');
const modalContent = document.getElementById('modal-content');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const backdrop = document.getElementById('modal-backdrop');
const form = document.getElementById('report-form');
const getLocationBtn = document.getElementById('get-location-btn');
const locationDisplay = document.getElementById('location-display');
const addressText = document.getElementById('address-text');
const submitBtn = document.getElementById('submit-btn');
const feedContainer = document.getElementById('feed-container');
const cursorGlow = document.getElementById('cursor-glow');

// Safety Guide DOM Elements
const safetyModal = document.getElementById('safety-modal');
const safetyModalContent = document.getElementById('safety-modal-content');
const safetyTabsContainer = document.getElementById('safety-tabs');
const safetyContentContainer = document.getElementById('safety-content');
const openSafetyBtn = document.getElementById('open-safety-btn');
const closeSafetyBtn = document.getElementById('close-safety-modal-btn');
const safetyBackdrop = document.getElementById('safety-modal-backdrop');

// --- Cursor Glow Logic ---
document.addEventListener('mousemove', (e) => {
    if(cursorGlow) {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
    
    // Text Spotlight tracking
    const spotlight = document.getElementById('text-spotlight');
    if(spotlight) {
        spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
        spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
});
document.addEventListener('mouseleave', () => {
    if(cursorGlow) cursorGlow.style.opacity = '0';
});

// --- Map Initialization ---
function initMap() {
    // Center roughly on India if no reports, otherwise center on the latest report
    const center = reports.length > 0 ? [reports[0].latitude, reports[0].longitude] : [20.5937, 78.9629];
    
    map = L.map('map').setView(center, 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    renderMarkers();
}

// --- Icons & Styling ---
function getIconForType(type) {
    switch (type) {
        case 'Fire': return '<i class="fa-solid fa-fire text-danger text-xl"></i>';
        case 'Flood': return '<i class="fa-solid fa-water text-blue-400 text-xl"></i>';
        case 'Theft': return '<i class="fa-solid fa-mask text-primary text-xl"></i>';
        case 'Bomb': return '<i class="fa-solid fa-bomb text-gray-400 text-xl"></i>';
        case 'Earthquake': return '<i class="fa-solid fa-house-crack text-yellow-600 text-xl"></i>';
        case 'Accident': return '<i class="fa-solid fa-car-burst text-orange-400 text-xl"></i>';
        default: return '<i class="fa-solid fa-triangle-exclamation text-warning text-xl"></i>';
    }
}

function getMarkerColor(severity) {
    switch (severity) {
        case 'Critical': return 'hsl(0, 90%, 55%)'; // Red
        case 'High': return 'hsl(30, 90%, 55%)'; // Orange
        case 'Medium': return 'hsl(60, 90%, 55%)'; // Yellow
        case 'Low': return 'hsl(200, 90%, 55%)'; // Blue
        default: return 'gray';
    }
}

function getSeverityBadgeClass(severity) {
    switch (severity) {
        case "Critical": return "bg-red-500 text-white border-red-500/50";
        case "High": return "bg-orange-500 text-white border-orange-500/50";
        case "Medium": return "bg-yellow-500 text-black border-yellow-500/50";
        case "Low": return "bg-blue-500 text-white border-blue-500/50";
        default: return "bg-gray-500 text-white border-gray-500/50";
    }
}

// --- Safety Guide Logic ---
function renderSafetyTabs() {
    safetyTabsContainer.innerHTML = '';
    safetyDisasterOrder.forEach(type => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'safety-tab w-full text-left px-3 sm:px-4 py-3 text-sm flex items-center gap-2 transition-colors';
        tab.dataset.type = type;
        tab.innerHTML = `<span class="safety-section-icon">${getIconForType(type)}</span><span class="hidden sm:inline truncate">${type}</span>`;
        tab.addEventListener('click', () => setActiveSafetyType(type));
        safetyTabsContainer.appendChild(tab);
    });
    updateSafetyTabStyles();
}

function updateSafetyTabStyles() {
    safetyTabsContainer.querySelectorAll('.safety-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === activeSafetyType);
    });
}

function renderSafetyList(title, iconClass, items) {
    const listItems = items.map(item => `
        <li class="text-sm text-white/70 leading-relaxed flex gap-2">
            <span class="text-white/30 mt-1">&bull;</span>
            <span>${item}</span>
        </li>
    `).join('');

    return `
        <div class="mb-6">
            <h4 class="text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2 ${iconClass.color}">
                <i class="fa-solid ${iconClass.icon}"></i> ${title}
            </h4>
            <ul class="space-y-2">${listItems}</ul>
        </div>
    `;
}

function renderSafetyContent() {
    const data = safetyGuide[activeSafetyType];
    if (!data) return;

    safetyContentContainer.innerHTML = `
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                ${getIconForType(activeSafetyType)}
            </div>
            <div>
                <h3 class="text-lg font-semibold text-white/90">${activeSafetyType} Safety</h3>
                <p class="text-xs text-white/40">${data.summary}</p>
            </div>
        </div>
        ${renderSafetyList('Before', { icon: 'fa-circle-info', color: 'text-blue-400' }, data.before)}
        ${renderSafetyList('During', { icon: 'fa-triangle-exclamation', color: 'text-warning' }, data.during)}
        ${renderSafetyList('After', { icon: 'fa-rotate-left', color: 'text-success' }, data.after)}
    `;
}

function setActiveSafetyType(type) {
    activeSafetyType = safetyGuide[type] ? type : 'Other';
    updateSafetyTabStyles();
    renderSafetyContent();
}

function openSafetyModal(type) {
    if (type) setActiveSafetyType(type);
    safetyModal.classList.remove('opacity-0', 'pointer-events-none');
    safetyModalContent.classList.remove('scale-95');
}

function closeSafetyModal() {
    safetyModal.classList.add('opacity-0', 'pointer-events-none');
    safetyModalContent.classList.add('scale-95');
}

// Exposed globally so it can be called from dynamically-injected map popup HTML
window.openSafetyModal = openSafetyModal;

openSafetyBtn.addEventListener('click', () => openSafetyModal());
closeSafetyBtn.addEventListener('click', closeSafetyModal);
safetyBackdrop.addEventListener('click', closeSafetyModal);

// --- Rendering ---
function renderMarkers() {
    // Clear existing layers (hacky way for vanilla JS without keeping track of markers)
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    reports.forEach(report => {
        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getMarkerColor(report.severity)}" width="36px" height="36px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        
        const customIcon = L.divIcon({
            html: svgIcon,
            className: "custom-leaflet-icon",
            iconSize: [36, 36],
            iconAnchor: [18, 36],
        });

        const popupContent = `
            <div class="p-1">
                <h3 class="font-bold text-lg mb-1">${report.type}</h3>
                <p class="text-sm font-semibold mb-2" style="color: ${getMarkerColor(report.severity)}">Severity: ${report.severity}</p>
                <p class="text-sm text-gray-300">${report.description}</p>
                <p class="text-xs text-gray-400 mt-2">${report.address}</p>
                <button onclick="window.openSafetyModal('${report.type}')" class="mt-3 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-lg px-3 py-2 text-xs font-semibold transition-colors">
                    <i class="fa-solid fa-shield-halved"></i> Safety Tips
                </button>
            </div>
        `;

        L.marker([report.latitude, report.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent);
    });
}

function timeSince(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

function renderFeed() {
    feedContainer.innerHTML = '';
    
    if (reports.length === 0) {
        feedContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 text-white/50 text-center">
                <i class="fa-solid fa-shield-cat text-4xl mb-4 opacity-50"></i>
                <p>No active disasters reported.<br/>Stay safe!</p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedReports.forEach(report => {
        const item = document.createElement('div');
        item.className = 'border-b border-white/5 py-4 cursor-pointer flex flex-col gap-2 group last:border-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors';
        
        item.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-sm group-hover:bg-white/10 transition-colors">
                        ${getIconForType(report.type)}
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-white/90 tracking-wide">${report.type}</h3>
                        <p class="text-[11px] text-white/40 uppercase tracking-wider">${timeSince(report.createdAt)}</p>
                    </div>
                </div>
                <button class="safety-tip-btn p-2 -mr-2 -mt-1 text-white/30 hover:text-primary transition-colors" title="View safety tips">
                    <i class="fa-solid fa-shield-halved"></i>
                </button>
            </div>
            <p class="text-sm text-white/60 line-clamp-2 leading-relaxed pl-11">
                ${report.description}
            </p>
        `;

        // Click anywhere on the item (except the safety button) to pan the map
        item.addEventListener('click', () => {
            map.flyTo([report.latitude, report.longitude], 12);
        });

        // Click the shield icon to open relevant safety tips instead of panning the map
        const safetyBtn = item.querySelector('.safety-tip-btn');
        safetyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSafetyModal(report.type);
        });

        feedContainer.appendChild(item);
    });
}

// --- Modal Logic ---
function openModal() {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
}

function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.add('scale-95');
    // Reset form
    form.reset();
    currentLocation = null;
    locationDisplay.classList.add('hidden');
    getLocationBtn.classList.remove('hidden');
    submitBtn.disabled = true;
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

// --- Geolocation Logic ---
getLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    getLocationBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
            // Reverse Geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            
            currentLocation = {
                lat,
                lng,
                address: data.display_name || "Unknown Location"
            };
            
            addressText.textContent = currentLocation.address;
            getLocationBtn.classList.add('hidden');
            locationDisplay.classList.remove('hidden');
            submitBtn.disabled = false;
        } catch (error) {
            alert("Failed to fetch address details.");
            getLocationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
        }
    }, () => {
        alert("Unable to retrieve your location. Please allow location access.");
        getLocationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
    });
});

// --- Form Submission ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentLocation) return;

    const newReport = {
        id: Date.now().toString(),
        type: document.getElementById('type-select').value,
        severity: document.getElementById('severity-select').value,
        description: document.getElementById('description-text').value,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        address: currentLocation.address,
        createdAt: new Date().toISOString()
    };

    // Add to state
    reports.unshift(newReport); // Add to beginning
    
    // Save to local storage
    localStorage.setItem('disaster_reports', JSON.stringify(reports));

    // Update UI
    renderMarkers();
    renderFeed();
    
    // Pan map to new report
    map.flyTo([newReport.latitude, newReport.longitude], 10);

    closeModal();

    // Surface relevant safety tips right after a report is filed
    openSafetyModal(newReport.type);
});

// --- Init App ---
window.onload = () => {
    initIntroReveal();
    initMap();
    renderFeed();
    renderSafetyTabs();
    renderSafetyContent();
    
    // Update timestamps dynamically
    setInterval(renderFeed, 60000);
};
