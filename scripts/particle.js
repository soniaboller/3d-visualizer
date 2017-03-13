var app = app || {};
app.init = init;
app.animate = animate;
var container, points = [];
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var start = Date.now();

container = document.createElement('div');
container.setAttribute('id', 'container');
document.body.appendChild(container);
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set( 0, 0, 50 );
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClearColor = true;
container.appendChild(renderer.domElement);
controls = new THREE.OrbitControls( camera, renderer.domElement );
container.addEventListener('click', rendererClick, false);

var GuiControls = function(){
    this.spacing = 15;
    this.angle = 0.975000;
    this.animationSpeed = 0.00001;
    this.intensity = 1;
    this.zoomSpeed = 0.01;
    this.colorIntensity = 0.5;
    this.rotationSpeed = 0.0001;
    this.sphere = true;
    this.donut = false;
    this.longDonut = false;
    this.perogi = false;
    this.square = false;
    this.quadangle = false;
    this.infinity = false;
    this.hourglass = false;
    this.spade = false;
    this.particleOne = 0x00ff00;
    this.particleTwo = 0x0000ff;
    this.particleThree = 0xff0000;

};

var matrix = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
// gui.add(matrix, 'spacing', 0, 50).step(0.1).name('Particle Spacing');
gui.add(matrix, 'angle', 0, 25).step(0.1).name('Particle Angle');
gui.add(matrix, 'animationSpeed', 0.0000001, 0.01).step(0.00001).name('Animation Speed');
gui.add(matrix, 'intensity', 0.5, 5).step(0.1).name('Reaction Intensity');
gui.add(matrix, 'colorIntensity', 0.25, 5).step(0.01).name('Color Intensity');
gui.add(matrix, 'zoomSpeed', 0.001, 0.1).step(0.001).name('Zoom Speed');
gui.add(matrix, 'rotationSpeed', 0, 0.1).step(0.000005).name('Z-index Rotation Speed');
gui.addColor(matrix, 'particleOne').name('Color 1');
gui.addColor(matrix, 'particleTwo').name('Color 2');
gui.addColor(matrix, 'particleThree').name('Color 3');

var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
init();

function init() {
    for (var i = 0; i < 2048; i++) {
        var geometry = new THREE.Geometry();
        var vertex = new THREE.Vector3();
        // vertex.x = 20 * Math.sin(i/10) * Math.cos(i);
        // vertex.y = 20 * Math.cos(i/10);
        // vertex.z = 20 * Math.sin(i) * Math.sin(i/10);
        // // // vertex.y = i/100 * Math.cos(i/10) - i/100 * Math.sin(i/10);
        geometry.vertices.push(vertex);
        // geometry.colors.push(new THREE.Color(purpleColors[ Math.floor(Math.random() * purpleColors.length) ]));
        // geometry.colors.push(new THREE.Color(0xffffff));
        var material = new THREE.PointsMaterial( {
            color: 0xffffff,
            // vertexColors: THREE.VertexColors,
            depthTest: true,
            opacity: 1,
            sizeAttenuation: true
        } );
        var particle = new THREE.Points( geometry, material );
        particle.position.x = 20 * Math.sin(i/10) * Math.cos(i);
        particle.position.y = 20 * Math.cos(i/10);
        particle.position.z = 20 * Math.sin(i) * Math.sin(i/10);
        scene.add( particle );
        points.push( particle );
    }
    // var sphereGeo = new THREE.SphereGeometry( 10, 32, 32 );
    // var sphereMat = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.33} );
    // var sphere = new THREE.Mesh( sphereGeo, sphereMat );
    // scene.add( sphere );
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX ) * 7;
    mouseY = (event.clientY - windowHalfY ) * 7;
}

function animate() {
    app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(animate);
    stats.begin();
    render();
    stats.end();
}

function render() {
    // var timeFrequencyData = new Uint8Array(analyser.fftSize);
    var timeFloatData = new Float32Array(analyser.fftSize);
    // analyser.getByteTimeDomainData(timeFrequencyData);
    analyser.getFloatTimeDomainData(timeFloatData);

    for (var j = 0; j < points.length; j++){
        var point = points[j];
        var r, g, b;
        var intensity = timeFloatData[j] * matrix.colorIntensity;
        point.geometry.colorsNeedUpdate = true;
        // var timer = Date.now() - start;
        point.material.size = 0.4 + (timeFloatData[j]/2.5);
        if (j%3 !== 0 && j%2 !==0){
            point.material.color.set(matrix.particleOne);
            r = point.material.color.r;
            g = point.material.color.g;
            b = point.material.color.b;
            point.material.color.setRGB((r + intensity), (g + intensity), (b + intensity));
        }
        else if (j%2 === 0){
            point.material.color.set(matrix.particleTwo);
            r = point.material.color.r;
            g = point.material.color.g;
            b = point.material.color.b;
            point.material.color.setRGB((r + intensity), (g + intensity), (b + intensity));
        }
        else if(j%3 === 0){
            point.material.color.set(matrix.particleThree);
            r = point.material.color.r;
            g = point.material.color.g;
            b = point.material.color.b;
            point.material.color.setRGB((r + intensity), (g + intensity), (b + intensity));
        }

        // point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j) + Math.cos(j));
        // point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
        // point.position.z = matrix.spacing * (Math.sin(j) * Math.sin(j/matrix.angle) + Math.sin(j));
        // point.position.z = matrix.spacing * (Math.sin(j) * Math.sin(j/matrix.angle)) + (Math.abs( Math.cos( timer * 0.002 ) ));


        // matrix.spacing = 15 || matrix.spacing;
        // point.position.x = matrix.spacing * (Math.pow(Math.sin(j), 3));
        // point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) * (2*Math.sin(j)*Math.sin(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
        // point.position.z = (matrix.spacing/2) * (Math.cos(j)) - (5 * Math.cos(2 * j)) - (2 * Math.cos(3 * j)) - Math.cos(4 * j);


        // OG
        if(matrix.sphere){
            matrix.spacing = 15 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j));
        }
        //donut
        else if(matrix.donut){
            matrix.spacing = 10 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j) + Math.cos(j));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j) + Math.sin(j));
        }

        // long donut -- 14.3
        else if(matrix.longDonut){
            matrix.spacing = 9 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) + Math.cos(j));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) + Math.sin(j));
        }
        // perogi
        else if(matrix.perogi){
            matrix.spacing = 15 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.cos(j/matrix.angle) * Math.cos(j));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j));
        }
        // square thing
        else if(matrix.square){
            matrix.spacing = 10 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j) + Math.sin(j));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j) + Math.cos(j));
        }
        //quadangle!
        else if(matrix.quadangle){
            matrix.spacing = 10 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j) + Math.sin(j));
            point.position.y = matrix.spacing * (Math.sin(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j) + Math.cos(j));
        }
        // tighter infinity -- remove z matrix rotaiton for this
        else if(matrix.infinity){
            matrix.spacing = 10 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j) + Math.cos(2*j/matrix.angle));
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j) + Math.sin(2*j/matrix.angle));
        }
        // hourglass
        else if(matrix.hourglass){
            matrix.spacing = 15 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j));
            point.position.y = matrix.spacing * (Math.sin(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) * Math.sin(j));
        }
        // spade
        else if(matrix.spade){
            matrix.spacing = 10 || matrix.spacing;
            point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * (2 * Math.cos(j))) * Math.sin(j);
            point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity) + (10 * Math.cos(j));
            point.position.z = matrix.spacing * (Math.sin(j/matrix.angle)) * (2 * Math.sin(j)) * Math.sin(j);
        }


        // also a long donut
        // else if(matrix.longDonut2){
        //     matrix.spacing = 10 || matrix.spacing;
        //     point.position.x = matrix.spacing * (Math.cos(j/matrix.angle) + Math.cos(j));
        //     point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
        //     point.position.z = matrix.spacing * (Math.sin(j/matrix.angle) + Math.sin(j));
        // }


        // hourglass
        // matrix.spacing = 15 || matrix.spacing;
        // point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j));
        // point.position.y = matrix.spacing * (Math.sin(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
        // point.position.z = matrix.spacing * (Math.sin(j) * Math.sin(j/matrix.angle));

        // spade
        // point.position.x = matrix.spacing * (Math.sin(j/matrix.angle) * Math.cos(j))*Math.sin(j);
        // point.position.y = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity) +(5*Math.cos(j));
        // point.position.z = matrix.spacing * (Math.sin(j) * Math.sin(j/matrix.angle))*Math.sin(j);


        // star thang rotation speed = 0.00413
        // point.position.y = matrix.spacing * (Math.cos(j/matrix.angle) * Math.cos(j) / Math.sin(j));
        // point.position.z = matrix.spacing * (Math.cos(j/matrix.angle)) + (timeFloatData[j] * matrix.intensity);
        // point.position.x = matrix.spacing * (Math.sin(j) * Math.sin(j/matrix.angle) / Math.cos(j));

    }
    matrix.angle += matrix.animationSpeed;

    var x = camera.position.x;
    var z = camera.position.z;
    camera.position.x = x * Math.cos(matrix.zoomSpeed) - z * Math.sin(matrix.zoomSpeed);
    camera.position.z = z * Math.cos(matrix.zoomSpeed) + x * Math.sin(matrix.zoomSpeed);

    // var z = camera.position.z;
    var y = camera.position.y;
    camera.position.y = y * Math.cos(matrix.zoomSpeed) + z * Math.sin(matrix.zoomSpeed);
    camera.position.z = z * Math.cos(matrix.zoomSpeed) - y * Math.sin(matrix.zoomSpeed);

    var rotationMatrix = new THREE.Matrix4().makeRotationZ( Math.PI * matrix.rotationSpeed );
    camera.up.applyMatrix4(rotationMatrix);

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function rendererClick(){
    var inputs = ($('input'));
    for (var f = 0; f < inputs.length; f++){
        inputs[f].blur();
    }
}

function onKeyDown(e) {
    if ( $('input:focus').length === 0 ) {
        switch (e.which) {
            case 32:
                if (app.play) {
                    app.audio.pause();
                    app.play = false;
                } else {
                    app.audio.play();
                    app.play = true;
                }
                break;
            case 49:
                //1
                matrix.sphere = true;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 50:
                //2
                matrix.sphere = false;
                matrix.donut = true;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 51:
                //3
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = true;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 52:
                //4
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = true;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 53:
                //5
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = true;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 54:
                //6
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = true;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 55:
                //7
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = true;
                matrix.hourglass = false;
                matrix.spade = false;
                break;
            case 56:
                //8
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = true;
                matrix.spade = false;
                break;
            case 57:
                //9
                matrix.sphere = false;
                matrix.donut = false;
                matrix.longDonut = false;
                matrix.perogi = false;
                matrix.square = false;
                matrix.quadangle = false;
                matrix.infinity = false;
                matrix.hourglass = false;
                matrix.spade = true;
                break;
        }
    }
}