// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebrationBanner = document.getElementById("celebrationBanner");
const celebrationText = document.getElementById("celebrationText");
const attendeeList = document.getElementById("attendeeList");
const attendeeListToggle = document.getElementById("attendeeListToggle");

// Track attendance
let count = Number(localStorage.getItem("attendeeCount")) || 0;
const maxCount = 20;
const teamNames = ["water", "zero", "power"];
const teamGoal = maxCount / teamNames.length;
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = JSON.parse(localStorage.getItem("attendeeList")) || [];

function saveProgress() {
  localStorage.setItem("attendeeCount", String(count));
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendees));
}

function updateTeamCountersOnPage() {
  const teamNames = Object.keys(teamCounts);

  teamNames.forEach(function (team) {
    const teamCounter = document.getElementById(team + "Count");
    if (teamCounter) {
      teamCounter.textContent = String(teamCounts[team]);
    }
  });
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  attendees.forEach(function (person) {
    const listItem = document.createElement("li");
    listItem.textContent = `${person.name} - ${person.team}`;
    attendeeList.appendChild(listItem);
  });
}

function updateCelebration() {
  let winningTeam = "";
  let topScore = 0;

  teamNames.forEach(function (team) {
    if (teamCounts[team] > topScore) {
      topScore = teamCounts[team];
      winningTeam = team;
    }
  });

  if (count >= maxCount && winningTeam && topScore >= teamGoal) {
    celebrationText.textContent = `🎉 Goal reached! ${teamLabels[winningTeam]} wins the celebration!`;
    celebrationBanner.classList.add("show");
  } else {
    celebrationBanner.classList.remove("show");
  }
}

function updateProgress() {
  attendeeCount.textContent = String(count);

  const percentage = (count / maxCount) * 100;
  progressBar.style.width = `${percentage}%`;

  updateCelebration();
}

function showGreeting(name, teamName) {
  greeting.textContent = `Welcome ${name}! You checked in for ${teamName}.`;
  greeting.style.display = "block";
  greeting.classList.add("success-message");
}

function toggleAttendeeList() {
  if (attendeeList.classList.contains("hidden")) {
    attendeeList.classList.remove("hidden");
    attendeeListToggle.textContent = "Hide List";
  } else {
    attendeeList.classList.add("hidden");
    attendeeListToggle.textContent = "Show List";
  }
}

attendeeListToggle.addEventListener("click", function () {
  toggleAttendeeList();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) {
    return;
  }

  count++;
  teamCounts[team] = Number(teamCounts[team]) + 1;
  attendees.push({
    name: name,
    team: teamName,
  });

  saveProgress();
  updateTeamCountersOnPage();
  updateProgress();
  renderAttendeeList();
  showGreeting(name, teamName);

  form.reset();
});

updateTeamCountersOnPage();
updateProgress();
renderAttendeeList();
