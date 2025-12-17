function addToQueue(track, queueContainer, queueTemplate) {
  const queueItem = queueTemplate.content.cloneNode(true);
  queueItem.querySelector("span").textContent = track.name;
  queueContainer.appendChild(queueItem);
}

function playlistDisplay(track, playlistContainer, playlistTemplate) {
  const playlistItem = playlistTemplate.content.cloneNode(true);
  playlistItem.querySelector(".playlist-title").textContent = track.name;
  playlistItem.querySelector(".playlist-desc").textContent = track.desc;
  playlistItem.querySelector(".play-btn").dataset.idx = track.idx;
  playlistContainer.appendChild(playlistItem);
}

const audio = new Audio();
const songs = [
  { name: "Test Song 1", path: "assets/songs/song1.mp3" },
  { name: "Test Song 2", path: "assets/songs/song1.mp3" },
];
let currentIdx = 0;
let queueAdded = false;

const playBtn = document.getElementById("song-status-btn");
const prevBtn = document.querySelector(".playbar-actions img:first-child");
const nextBtn = document.querySelector(".playbar-actions img:last-child");
const progressEl = document.querySelector("progress");
const nameEl = document.querySelector(".song-name");
const currTimeEl = document.getElementById("currentTime");
const durEl = document.getElementById("duration");
const progressBarContainer = document.querySelector(".playbar-progress");

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
}

function loadSong(idx) {
  audio.src = songs[idx].path;
  nameEl.textContent = songs[idx].name;
  audio.load();
  queueAdded = false;
  currentIdx = idx;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.src = "assets/pause.svg";
  } else {
    audio.pause();
    playBtn.src = "assets/play.svg";
  }
}

audio.addEventListener("loadedmetadata", () => {
  durEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressEl.value = percent || 0;
  currTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  playBtn.src = "assets/play.svg";
  progressEl.value = 0;
});

playBtn.addEventListener("click", togglePlay);

prevBtn.addEventListener("click", () => {
  currentIdx = (currentIdx - 1 + songs.length) % songs.length;
  loadSong(currentIdx);
  togglePlay();
});

nextBtn.addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % songs.length;
  loadSong(currentIdx);
  togglePlay();
});

progressBarContainer.addEventListener("click", (e) => {
  const width = progressBarContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("play", () => {
  if (!queueAdded) {
    const queueTemplate = document.getElementById("queue-template");
    const queueContainer = document.getElementById("queue-container");
    addToQueue(songs[currentIdx], queueContainer, queueTemplate);
    queueAdded = true;
  }
});

loadSong(currentIdx);

// -----------------------------------------------------------------------------
// TESTING FUNCTIONS
function testPlaySong() {
  // play the first index
  currentIdx = 0;
  loadSong(currentIdx);
  // togglePlay();
}

// testPlaySong();

function testQueue() {
  const queueTemplate = document.getElementById("queue-template");
  const queueContainer = document.getElementById("queue-container");
  const songInfo = {
    name: "Your Queue test is getting too big so it cuts off",
  };
  for (let i = 0; i < 20; i++) {
    addToQueue(songInfo, queueContainer, queueTemplate);
  }
}

// testQueue();

function testPlaylist() {
  const playlistTemplate = document.getElementById("playlist-template");
  const playlistContainer = document.getElementById("playlist-container");

  for (let i = 0; i < 14; i++) {
    const songInfo = {
      name: `Test Song ${i + 1}`,
      desc: "This is some description",
      idx: i % songs.length,
    };
    playlistDisplay(songInfo, playlistContainer, playlistTemplate);
  }
}

testPlaylist();

// -----------------------------------------------------------------------------

const playListPlayBtns = document.querySelectorAll(".play-btn");
playListPlayBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentIdx = parseInt(btn.dataset.idx);
    loadSong(currentIdx);
    togglePlay();
  });
});

const hamburgerBtn = document.querySelector(".hamburger-btn");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

// Store references to the sidebars and their original parents immediately
const sidebarReferences = [];
document.querySelectorAll(".container").forEach((container) => {
  const sidebar = container.querySelector(".sidebar");
  if (sidebar) {
    sidebarReferences.push({ sidebar, originalContainer: container });
  }
});

function checkSidebar() {
  const isMobile = window.innerWidth < 640;

  sidebarReferences.forEach(({ sidebar, originalContainer }) => {
    if (isMobile) {
      if (!sidebarOverlay.contains(sidebar)) {
        sidebarOverlay.appendChild(sidebar);
      }
    } else {
      if (!originalContainer.contains(sidebar)) {
        originalContainer.insertBefore(sidebar, originalContainer.firstChild);
      }
    }
  });

  if (!isMobile) {
    document.body.classList.remove("hamburger-open");
  }
}

checkSidebar();

window.addEventListener("resize", checkSidebar);

hamburgerBtn.addEventListener("click", () => {
  document.body.classList.toggle("hamburger-open");
});

sidebarOverlay.addEventListener("click", (e) => {
  if (e.target === sidebarOverlay) {
    document.body.classList.remove("hamburger-open");
  }
});

const volumeBtn = document.querySelector(".icon-btn");
const volumeInput = volumeBtn.querySelector("input");
const volumePopup = volumeBtn.querySelector(".volume-popup");
volumeBtn.addEventListener("click", (e) => {
  if (e.target === volumeInput) return;
  // show a popup with the volume slider
  volumePopup.classList.toggle("volume-popup-open");
});

volumeInput.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

audio.volume = 0.5;
volumeInput.value = 50;
