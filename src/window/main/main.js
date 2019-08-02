const electron = require('electron');
const { ipcRenderer } = electron;

const video = document.querySelector('#video');
const songName = document.querySelector('#songName');
const songArtist = document.querySelector('#songArtist');
const pausePlayButton = document.querySelector('#pausePlayButton');
const nextButton = document.querySelector('#nextButton');
const likeButton = document.querySelector('#likeButton');

let paused = false;
let currentSong = null;

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

/**
 * ipc
 */
ipcRenderer.on('main:receiveNextSong', (event, val) => {
  currentSong = val;

  songName.innerHTML = val.title;
  songArtist.innerHTML = val.artist;
  video.src = val.url;
});

// TODO: add length text

// TODO: move according to current time
