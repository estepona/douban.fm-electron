const Mousetrap = require('mousetrap');
const { ipcRenderer } = require('electron');

const { shortcuts } = require('../../../tsout/config/shortcut');

const video = document.getElementById('video');

const songTitle = document.getElementById('songTitle');
const songArtistAlbum = document.getElementById('songArtistAlbum');
const songTime = document.getElementById('songTime');

const pausePlayButton = document.getElementById('pausePlayButton');
const nextButton = document.getElementById('nextButton');
const likeButton = document.getElementById('likeButton');

let loggedIn = false;
let playerState = null;

let paused = false;
let liked = false;
let songLength = 0;
let songLengthFormatted = '';

/**
 * video defaults
 */
video.volume = 0.5;

/**
 * pausePlayButton event listeners
 */
pausePlayButton.addEventListener('mouseover', e => {
  if (paused) {
    pausePlayButton.src = '../../asset/icon/play-button-black.svg';
  } else {
    pausePlayButton.src = '../../asset/icon/pause-button-black.svg';
  }
});

pausePlayButton.addEventListener('mouseout', e => {
  if (paused) {
    pausePlayButton.src = '../../asset/icon/play-button-white.svg';
  } else {
    pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
  }
});

pausePlayButton.addEventListener('click', e => {
  if (paused) {
    video.play();
    paused = false;
    pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
  } else {
    video.pause();
    paused = true;
    pausePlayButton.src = '../../asset/icon/play-button-white.svg';
  }
});

/**
 * nextButton event listeners
 */
nextButton.addEventListener('mouseover', e => {
  nextButton.src = '../../asset/icon/next-button-black.svg';
});

nextButton.addEventListener('mouseout', e => {
  nextButton.src = '../../asset/icon/next-button-white.svg';
});

nextButton.addEventListener('click', e => {
  e.preventDefault();
  ipcRenderer.send('main:getNextSong', playerState);

  paused = false;
  pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
});

/**
 * likeButton event listeners
 */
likeButton.addEventListener('mouseover', e => {
  likeButton.src = '../../asset/icon/like-button-black.svg';
});

likeButton.addEventListener('mouseout', e => {
  if (liked) {
    likeButton.src = '../../asset/icon/like-button-red.svg';
  } else {
    likeButton.src = '../../asset/icon/like-button-white.svg';
  }
});

likeButton.addEventListener('click', e => {
  e.preventDefault();

  if (loggedIn) {
    if (liked) {
      ipcRenderer.send('main:unlikeSong', playerState);

      liked = false;
      likeButton.src = '../../asset/icon/like-button-white.svg';
    } else {
      ipcRenderer.send('main:likeSong', playerState);

      liked = true;
      likeButton.src = '../../asset/icon/like-button-red.svg';
    }
  }
});

/**
 * moreButton event listeners
 */
moreButton.addEventListener('mouseover', e => {
  moreButton.src = '../../asset/icon/more-button-horizontal-black.svg';
});

moreButton.addEventListener('mouseout', e => {
  moreButton.src = '../../asset/icon/more-button-horizontal-white.svg';
});

moreButton.addEventListener('click', e => {
  e.preventDefault();
  ipcRenderer.send('main:openOptionMenu');
});

/**
 * video event listeners
 */
video.addEventListener('ended', e => {
  e.preventDefault();
  ipcRenderer.send('main:getNextSong', playerState);

  paused = false;
  pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
});

video.addEventListener('timeupdate', e => {
  e.preventDefault();

  if (songLength) {
    const curMin = String(Math.floor(video.currentTime / 60)).padStart(2, '0');
    const curSec = String(Math.floor(video.currentTime % 60)).padStart(2, '0');
    songTime.innerHTML = `${curMin}:${curSec} / ${songLengthFormatted}`;
  }
});

/**
 * ipc
 */
ipcRenderer.on('main:login', (event, val) => {
  loggedIn = true;
});

ipcRenderer.on('main:logout', (event, val) => {
  loggedIn = false;
});

ipcRenderer.on('main:receiveNextSong', (event, val) => {
  playerState = val;

  // update songTitle, songArtistAlbum, video's src, likeButton
  songTitle.innerHTML = val.song.title;
  songArtistAlbum.innerHTML = `${val.song.artist}: ${val.song.albumtitle}`;
  video.src = val.song.url;
  if (val.song.like === 1 || val.channel === 'liked') {
    likeButton.src = '../../asset/icon/like-button-red.svg';
    liked = true;
  } else {
    likeButton.src = '../../asset/icon/like-button-white.svg';
    liked = false;
  }

  // add marquee animation if songTitle/songArtistAlbum exceeds container width
  if (songTitle.scrollWidth > 155) {
    songTitle.classList.add('marquee-animation');
  } else {
    songTitle.classList.remove('marquee-animation');
  }
  if (songArtistAlbum.scrollWidth > 155) {
    songArtistAlbum.classList.add('marquee-animation');
  } else {
    songArtistAlbum.classList.remove('marquee-animation');
  }

  // get song's length and format
  songLength = val.song.length;
  if (!songLength) {
    songLengthFormatted = '';
    songTime.innerHTML = '';
  } else {
    const lenMin = String(Math.floor(songLength / 60)).padStart(2, '0');
    const lenSec = String(Math.floor(songLength % 60)).padStart(2, '0');
    songLengthFormatted = `${lenMin}:${lenSec}`;
  }
});

/**
 * shortcuts
 */
Mousetrap.bind(shortcuts.pauseOrContinue, () => {
  if (paused) {
    video.play();
    paused = false;
    pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
  } else {
    video.pause();
    paused = true;
    pausePlayButton.src = '../../asset/icon/play-button-white.svg';
  }
});

Mousetrap.bind(shortcuts.next, () => {
  ipcRenderer.send('main:getNextSong', playerState);

  paused = false;
  pausePlayButton.src = '../../asset/icon/pause-button-white.svg';
});

Mousetrap.bind(shortcuts.like, () => {
  if (!liked) {
    ipcRenderer.send('main:likeSong', playerState);

    liked = true;
    likeButton.src = '../../asset/icon/like-button-red.svg';
  }
});

Mousetrap.bind(shortcuts.unlike, () => {
  if (liked) {
    ipcRenderer.send('main:unlikeSong', playerState);

    liked = false;
    likeButton.src = '../../asset/icon/like-button-white.svg';
  }
});

Mousetrap.bind(shortcuts.refresh, event => {
  event.preventDefault();

  ipcRenderer.send('main:refresh');
});

Mousetrap.bind(shortcuts.setWindowOnTop, event => {
  event.preventDefault();

  ipcRenderer.send('main:setWindowOnTop');
});

Mousetrap.bind(shortcuts.relaunch, event => {
  event.preventDefault();

  ipcRenderer.send('main:relaunch');
});

Mousetrap.bind(shortcuts.quit, event => {
  event.preventDefault();

  ipcRenderer.send('main:quit');
});

Mousetrap.bind(shortcuts.defaultClosePage, event => {
  event.preventDefault();
});

Mousetrap.bind(shortcuts.defaultSelectAll, event => {
  event.preventDefault();
});
