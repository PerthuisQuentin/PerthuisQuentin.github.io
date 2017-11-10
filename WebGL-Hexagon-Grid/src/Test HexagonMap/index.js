var container, stats;
var camera, scene, renderer;
var group;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;

init();
animate();

var TestMap;

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xF0F0F0);

	var axisHelper = new THREE.AxesHelper( 100 );
	scene.add( axisHelper );

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 300, -500);
	camera.lookAt(0, 0, 0);
	scene.add(camera);

	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add(light);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	
	document.body.appendChild( renderer.domElement );
	stats = new Stats();
	document.body.appendChild( stats.dom );
	window.addEventListener( 'resize', onWindowResize, false );

	var map = new HexagonalMap(7, 50, 5);
	TestMap = map;

	//TestMap.testGrid();
	var loader = new THREE.FontLoader();
	loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function(fontLoaded) {
		var font = {
			font: fontLoaded,
			size: 20,
			height: 1,
			curveSegments: 2
		};
		TestMap.setFont(font);

		TestMap.init();

		document.getElementById('oneMore').addEventListener('click', function() {
			TestMap.addRow();
		});
		document.getElementById('oneLess').addEventListener('click', function() {
			TestMap.removeRow();
		});

		document.getElementById('coordinatesON').addEventListener('click', function() {
			TestMap.enableCoordinates();
		});
		document.getElementById('coordinatesOFF').addEventListener('click', function() {
			TestMap.disableCoordinates();
		});
	});

	scene.add(map.getGroup());
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	TWEEN.update();
	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {
	renderer.render( scene, camera );
}
