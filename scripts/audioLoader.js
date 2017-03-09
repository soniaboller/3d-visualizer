var app = app || {};
var source;
var buffer;
var analyser;

window.onload = function () {

    if(window.innerWidth < 780){
        app.animate();
        console.log('hit')
    }

    var notification = document.getElementById('notification');
    notification.addEventListener('click', getMicInput, false);

    // app.init();
    // console.log('audio loader connected');

    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);

    function onDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    function onDrop(e) {
        notification.classList.add('hidden');
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;
        initiateAudio(droppedFiles[0]); // initiates audio from the dropped file
    }

    function initiateAudio(data) {
        if(app.audio){
            app.audio.remove();
            window.cancelAnimationFrame(app.animationFrame);
        }
        app.audio = document.createElement('audio'); // creates an html audio element
        app.audio.src = URL.createObjectURL(data); // sets the audio source to the dropped file
        app.audio.autoplay = true;
        // app.audio.play();
        app.play = true;
        document.body.appendChild(app.audio);
        app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
        source = app.ctx.createMediaElementSource(app.audio); // creates audio source
        analyser = app.ctx.createAnalyser(); // creates analyserNode
        source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
        source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
        app.animate();
    }

    function getMicInput(){
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
            app.ctx = new (window.AudioContext || window.webkitAudioContext)();
            source = app.ctx.createBufferSource();
            analyser = app.ctx.createAnalyser();
            analyser.fftSize = 2048;
            microphone = app.ctx.createMediaStreamSource(stream);
            microphone.connect(analyser);
            notification.classList.add('hidden');
            app.animate();
        }).catch(function(err) {
            console.log('error', err)
        });
    }
};

