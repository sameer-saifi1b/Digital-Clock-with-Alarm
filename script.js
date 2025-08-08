let is24Hour = false;
let isDarkMode = true;
let alarms = [];


// Cache audio element once
const alarmAudio = document.getElementById("alarmSound");
alarmAudio.loop = true; // Continuous until stopped

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Greeting
    let greetingText = "Hello!";
    if (hours < 12) {
        greetingText = "Good Morning 🌅";
    } else if (hours < 17) {
        greetingText = "Good Afternoon ☀️";
    } else if (hours < 21) {
        greetingText = "Good Evening 🌇";
    } else {
        greetingText = "Good Night 🌙";
    }
    document.getElementById("greeting").textContent = greetingText;

    // 12H or 24H format
    let ampm = "AM";
    if (!is24Hour) {
        ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
    }

    // Display time
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    document.getElementById("ampm").textContent = is24Hour ? "" : ampm;

    // Display date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date").textContent = now.toLocaleDateString(undefined, options);

    // Alarm check
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    alarms.forEach((alarm) => {
        if (alarm.time === currentTime && !alarm.triggered) {
            alarm.triggered = true;

            // Play sound only after user interaction
            alarmAudio.play().catch((e) => {
                console.warn("Sound blocked until user interacts.");
            });

            alert(`🔔 ${alarm.label}`);

            // Stop sound after alert closes
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
        }
    });
}

// Toggle between 24H / 12H
function toggleFormat() {
    is24Hour = !is24Hour;
    updateClock();
}

// Toggle light/dark theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("light-theme", !isDarkMode);
}

// Change background color
function changeBg(color) {
    document.body.style.backgroundColor = color;
}

// Add a new alarm
function addAlarm() {
    const time = document.getElementById("alarmTime").value;
    const label = document.getElementById("alarmLabel").value || "Alarm";

    if (!time) {
        alert("⚠️ Please enter a valid time.");
        return;
    }

    alarms.push({ time, label, triggered: false });
    displayAlarms();
    document.getElementById("alarmTime").value = "";
    document.getElementById("alarmLabel").value = "";

    // 🔹 Unlock audio by playing & pausing once
    alarmAudio.play().then(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }).catch(err => {
        console.warn("Audio unlock attempt failed:", err);
    });
}


// Display alarm list
function displayAlarms() {
    const list = document.getElementById("alarmList");
    list.innerHTML = "";

    alarms.forEach((alarm, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${alarm.time} - ${alarm.label}</span>
            <div>
                <button onclick="snoozeAlarm(${index})">Snooze</button>
                <button onclick="deleteAlarm(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Delete an alarm
function deleteAlarm(index) {
    alarms.splice(index, 1);
    displayAlarms();
}

// Snooze an alarm for 5 mins
function snoozeAlarm(index) {
    let [hour, minute] = alarms[index].time.split(":").map(Number);
    minute += 5;
    if (minute >= 60) {
        minute -= 60;
        hour = (hour + 1) % 24;
    }

    alarms[index].time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    alarms[index].triggered = false;
    alert("😴 Snoozed for 5 minutes.");
    displayAlarms();
}
