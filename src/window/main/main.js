const electron = require('electron');
const { ipcRenderer } = electron;

const video = document.querySelector('#video');

const songTitle = document.querySelector('#songTitle');
const songArtistAlbum = document.querySelector('#songArtistAlbum');
const songTime = document.querySelector('#songTime');

const pausePlayButton = document.querySelector('#pausePlayButton');
const nextButton = document.querySelector('#nextButton');
const likeButton = document.querySelector('#likeButton');

let paused = false;
let currentSong = null;
let songLength = 0;
let songLengthFormatted = '';

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
  ipcRenderer.send('main:getNextSong', currentSong);

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
  likeButton.src = '../../asset/icon/like-button-white.svg';
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
  ipcRenderer.send('main:getNextSong', currentSong);

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
ipcRenderer.on('main:receiveNextSong', (event, val) => {
  currentSong = val;

  // update songTitle, songArtistAlbum, vidro's src
  songTitle.innerHTML = val.title;
  songArtistAlbum.innerHTML = `${val.artist}: ${val.albumtitle}`;
  video.src = val.url;

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
  songLength = val.length;
  if (!songLength) {
    songLengthFormatted = '';
    songTime.innerHTML = '';
  } else {
    const lenMin = String(Math.floor(songLength / 60)).padStart(2, '0');
    const lenSec = String(Math.floor(songLength % 60)).padStart(2, '0');
    songLengthFormatted = `${lenMin}:${lenSec}`;
  }
});
