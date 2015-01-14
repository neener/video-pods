var scene, camera, renderer, objects;

var video, videocanvas, videocanvasctx;

var pointLight;

var sphere, spheretexture, sphereMesh, material;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var moveForward = false;
var moveBackwards = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var targetMoveLeft = false;
var targetMoveRight = false;

init();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 100, 150, 5000 );
	camera.target = new THREE.Vector3( 0, 150, 0 );

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// creating video element to hold video
	video = document.createElement( 'video' );
	video.setAttribute( 'loop', true );
	video.src = "textures/trailer.mp4";
	video.load(); // must call after setting/changing source

	// make video canvas
	videocanvas = document.createElement( 'canvas' );
	videocanvasctx = videocanvas.getContext( '2d' );

	// set its size
	videocanvas.width = 640;
	videocanvas.height = 480;

	// draw black rectangle so spheres don't start out transparent
	videocanvasctx.fillStyle = "#000000";
	videocanvasctx.fillRect( 0, 0, 640, 480 );

	// add canvas to new texture
	spheretexture = new THREE.Texture(videocanvas, new THREE.SphericalReflectionMapping());

	// add texture to material that will be wrapped around the sphere
	material = new THREE.MeshBasicMaterial( { map: spheretexture, overdraw: 0.5 } );

	// Spheres

	objects = [];

	sphere = new THREE.SphereGeometry( 100, 32, 32 );

	video.play()

	for ( var i = 0; i < 10; i ++ ) {

		sphereMesh = new THREE.Mesh( sphere, material );

		sphereMesh.position.x = Math.random() * 1000 - 500;
		sphereMesh.position.y = Math.random() * 1000 - 500;
		sphereMesh.position.z = Math.random() * 1000 - 500;

		sphereMesh.rotation.x = Math.random() * 200 - 100;
		sphereMesh.rotation.y = Math.random() * 200 - 100;
		sphereMesh.rotation.z = Math.random() * 200 - 100;

		sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = Math.random() + 0.5;

		objects.push( sphereMesh );

		scene.add( sphereMesh );

	}

	
	// Lights

	var ambientLight = new THREE.AmbientLight( Math.random() * 0x202020 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xff0000, 1 );
	scene.add( pointLight );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}



// function onDocumentKeyDown( event ) {

// 	switch ( event.keyCode ) {

// 		case 38: moveForward = true; break; // up
// 		case 40: moveBackwards = true; break; // down
// 		case 37: moveLeft = true; break; // left
// 		case 39: moveRight = true; break; // right
// 		case 87: moveUp = true; break; // w
// 		case 83: moveDown = true; break; // s
// 		case 65: targetMoveLeft = true; break; // a
// 		case 68: targetMoveRight = true; break; // d

// 	}

// }

// function onDocumentKeyUp( event ) {

// 	switch ( event.keyCode ) {

// 		case 38: moveForward = false; break; // up
// 		case 40: moveBackwards = false; break; // down
// 		case 37: moveLeft = false; break; // left
// 		case 39: moveRight = false; break; // right
// 		case 87: moveUp = false; break; // w
// 		case 83: moveDown = false; break; // s
// 		case 65: targetMoveLeft = false; break; // a
// 		case 68: targetMoveRight = false; break; // d

// 	}

// }


function render() {

	if ( moveForward ) camera.position.z -= 10;
	if ( moveBackwards ) camera.position.z += 10;

	if ( moveLeft ) camera.position.x -= 10;
	if ( moveRight ) camera.position.x += 10;

	if ( moveUp ) camera.position.y += 10;
	if ( moveDown ) camera.position.y -= 10;

	if ( targetMoveLeft ) camera.target.x -= 10;
	if ( targetMoveRight ) camera.target.x += 10;

	camera.lookAt( camera.target );


	for ( var i = 0, l = objects.length; i < l; i++ ) {

		var object = objects[ i ];

		object.rotation.x += 0.01;
		object.rotation.y += 0.005;
		object.position.y = Math.sin( object.rotation.x ) * 200;


	}

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

		videocanvasctx.drawImage( video, 0, 0 );

		spheretexture.needsUpdate = true;
	}

		renderer.render( scene, camera );

		window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);