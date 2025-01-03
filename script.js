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