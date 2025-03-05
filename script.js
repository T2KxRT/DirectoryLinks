let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', function(e) {
    const lightning = document.createElement('div');
    lightning.className = 'lightning-strike';

    // Calculate the direction of mouse movement
    const deltaX = e.pageX - lastMouseX;
    const deltaY = e.pageY - lastMouseY;

    // Calculate the angle of movement in radians
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the opposite angle (180 degrees or π radians from the current angle)
    const oppositeAngle = angle + Math.PI;

    // Position the lightning at the mouse pointer
    lightning.style.left = e.pageX + 'px';
    lightning.style.top = e.pageY + 'px';

    // Rotate the lightning to point in the opposite direction of movement
    lightning.style.transform = `translate(-50%, -50%) rotate(${oppositeAngle}rad)`;

    document.body.appendChild(lightning);

    // Remove the lightning after the animation ends
    setTimeout(() => {
        lightning.remove();
    }, 500);

    // Update the last mouse position
    lastMouseX = e.pageX;
    lastMouseY = e.pageY;
});

const musicButton = document.getElementById('musicButton');
let isPlaying = false;

musicButton.addEventListener('click', function() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        // Code to play music
        musicButton.classList.remove('paused');
    } else {
        // Code to pause music
        musicButton.classList.add('paused');
    }
});

document.addEventListener('mousemove', function(e) {

    const fogTrail = document.createElement('div');
    fogTrail.className = 'fog-trail';
    fogTrail.style.left = e.pageX + 'px';
    fogTrail.style.top = e.pageY + 'px';
    document.body.appendChild(fogTrail);

    setTimeout(() => {
        fogTrail.remove();
    }, 1000); // Remove the fog trail after 1 second
});

document.addEventListener('DOMContentLoaded', () => {
    const musicButton = document.getElementById('musicButton');
    const audio = new Audio('monario/musyka.mp3');
    audio.loop = true; // Loop the music

    // Web Audio API setup for muffled effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();
    const feedbackGainNode = audioContext.createGain();

    filter.type = 'lowpass'; // Muffled effect
    filter.frequency.value = 1000; // Adjust this value for more/less muffled effect

    gainNode.gain.value = 0.5; // Adjust this value for more/less echo
    feedbackGainNode.gain.value = 0.5; // Adjust this value for more/less feedback

    // Connect nodes: source -> filter -> gain -> feedback -> destination
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(feedbackGainNode);
    feedbackGainNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    let isPlaying = false; // Music is off by default

    // Function to fade in the audio
    const fadeIn = () => {
        audio.volume = 0;
        const fadeInInterval = setInterval(() => {
            if (audio.volume < 1) {
                audio.volume += 0.05; // Adjust the increment for faster/slower fade
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100); // Adjust the interval for smoother/faster fade
    };

    // Update the button to show that the music is off initially
    musicButton.innerHTML = '<i class="fas fa-music"></i> Play Music';
    musicButton.classList.remove('paused');

    // Toggle music playback
    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicButton.innerHTML = '<i class="fas fa-music"></i> Play Music';
            musicButton.classList.remove('paused');
        } else {
            // Resume the AudioContext if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            audio.play();
            fadeIn();
            musicButton.innerHTML = '<i class="fas fa-music"></i> Pause Music';
            musicButton.classList.add('paused');
        }
        isPlaying = !isPlaying;
    });

    // Fade in at the start of the loop
    audio.addEventListener('ended', () => {
        if (isPlaying) {
            audio.currentTime = 0; // Reset to the start
            audio.play();
            fadeIn();
        }
    });

    // Remove silence from the song
    audio.addEventListener('play', () => {
        if (audio.currentTime > 0) {
            audio.currentTime = 0;
        }
    });

    // Automatically play the music when the page loads
    audio.autoplay = false; // Set to false to prevent autoplay
    audio.muted = false;
});

// Function to create a twitch effect
function twitchElement(element, intensity) {
    element.style.transform = `translate(${Math.random() * intensity}px, ${Math.random() * intensity}px)`;
  }
  
  // Function to reset the twitch effect
  function resetTwitch(element) {
    element.style.transform = 'translate(0, 0)';
  }
  
  // Function to sync animations with music
  function syncAnimationsWithMusic(audioContext, source, elements) {
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    function animate() {
      requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);
  
      const bass = dataArray[0] / 255; // Normalize bass value
      const intensity = bass * 10; // Adjust intensity based on bass
  
      elements.forEach(element => {
        twitchElement(element, intensity);
        setTimeout(() => resetTwitch(element), 100); // Reset after 100ms
      });
    }
  
    animate();
  }
  
  // Apply the effect to the title, description, and platform icons
  document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('header h1');
    const description = document.querySelector('main p');
    const platformIcons = document.querySelectorAll('.fab');
  
    const elementsToAnimate = [title, description, ...platformIcons];
  
    // Get the audio context and source from the existing music setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audio = new Audio('monario/musyka.mp3');
    const source = audioContext.createMediaElementSource(audio);
  
    // Sync animations with music
    syncAnimationsWithMusic(audioContext, source, elementsToAnimate);
  });

  // Function to transform the page
// Function to transform the page
function transformPage() {
    // Remove all existing content
    document.body.innerHTML = '';

    // Add the background video
    const video = document.createElement('video');
    video.src = 'curu/mâncărimea.mp4';
    video.autoplay = true;
    video.loop = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-1';
    document.body.appendChild(video);

    // Add the audio
    const audio = new Audio('între-două-nu-te-plouă/spune-alup-invers.mp3');
    audio.volume = 1.0; // Set volume to maximum
    audio.autoplay = true;

    // Start the audio at the 1-second mark
    audio.currentTime = 1;

    // Reload the page 1 second after the audio ends
    audio.addEventListener('ended', () => {
        setTimeout(() => {
            window.location.reload();
        }, 1000); // 1000ms = 1 second
    });

    document.body.appendChild(audio);
}
  
  // Add event listener to the link
  document.getElementById('mancareLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    transformPage(); // Transform the page
  });

// Add to Spotify local files
document.getElementById('localFilesLink').onclick = function(event) {
  event.preventDefault(); // Prevent default link behavior
  const popup = document.getElementById('localFilesPopup');
  popup.style.display = 'block';
  setTimeout(() => {
    popup.classList.add('active');
  }, 10); // Small delay to trigger the transition
};

document.getElementById('closePopup').onclick = function() {
  const popup = document.getElementById('localFilesPopup');
  popup.classList.remove('active');
  setTimeout(() => {
    popup.style.display = 'none';
  }, 500); // Wait for the animation to complete

  // Open Spicetify popup
  const spicetifyPopup = document.getElementById('spicetifyPopup');
  spicetifyPopup.style.display = 'block';
  setTimeout(() => {
    spicetifyPopup.classList.add('active');
  }, 10); // Small delay to trigger the transition
};

// Close Spicetify popup
document.getElementById('closeSpicetifyPopup').onclick = function() {
  const spicetifyPopup = document.getElementById('spicetifyPopup');
  spicetifyPopup.classList.remove('active');
  setTimeout(() => {
    spicetifyPopup.style.display = 'none';
  }, 500); // Wait for the animation to complete
};

// Add touch event listener for mobile devices
document.addEventListener('touchmove', function(e) {
    const touch = e.touches[0]; // Get the first touch point
    const lightning = document.createElement('div');
    lightning.className = 'lightning-strike';
  
    // Position the lightning at the touch point
    lightning.style.left = touch.pageX + 'px';
    lightning.style.top = touch.pageY + 'px';
  
    document.body.appendChild(lightning);
  
    // Remove the lightning after the animation ends
    setTimeout(() => {
      lightning.remove();
    }, 500);
  });