
//Set up scene, camera, and renderer
var scene = new THREE.Scene;
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
 
var renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
				
var video = document.createElement('video');
video.src = "textures/trailer.mp4";
 
//make your video canvas
var videocanvas = document.createElement('canvas');
var videocanvasctx = videocanvas.getContext('2d');
 
//set its size
videocanvas.width = 640;
videocanvas.height = 480;
 
//draw a black rectangle so that your spheres don't start out transparent
videocanvasctx.fillStyle = "#000000";
videocanvasctx.fillRect(0,0,640,480);
 
//add canvas to new texture
var spheretexture = new THREE.Texture(videocanvas);
 
//add texture to material that will be wrapped around the sphere
var material = new THREE.MeshBasicMaterial( { map: spheretexture, overdraw: 0.5 } );
 
 
//Use whatever values you were using for the sizes of the spheres before
var sphere = new THREE.SphereGeometry( 100, 32, 32 );
 
//make a mesh from the material and the geometry (the sphere)
var sphereMesh = new THREE.Mesh(sphere, material);
 
//Run your render function, checking the video for data and writing it to the canvas if there is any (this assumes you already have your video on the page and its element saved to the variable ‘video’
 
function render(){
    //check for vid data
    if(video.readyState === video.HAVE_ENOUGH_DATA){
      //draw video to canvas starting from upper left corner
      videocanvasctx.drawImage(video, 0, 0);
      //tell texture object it needs to be updated
      spheretexture.needsUpdate = true;
    }
      renderer.render(scene, camera); //Same as how you always render a 3js scene
      
      window.requestAnimationFrame(render); //When finished rendering, ask to render again on the next frame
}
 
window.requestAnimationFrame(render); //Start render loop