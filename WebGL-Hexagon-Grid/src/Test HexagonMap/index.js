var container, stats;
var camera, scene, renderer;
var group;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var lastMouse = new THREE.Vector2();
var map;
var selectedMesh;

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

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	
	document.body.appendChild( renderer.domElement );
	stats = new Stats();
	document.body.appendChild(stats.dom);
	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener('mouseup', onMouseUp, false);

	map = new HexagonalMap(7, 50, 5);
	TestMap = map;

	TestMap.init();

	document.getElementById('oneMore').addEventListener('click', TestMap.addRow);
	document.getElementById('oneLess').addEventListener('click', TestMap.removeRow);

	var animSelect = document.getElementById("animation");
	document.getElementById('startAnim').addEventListener('click', function() {
		var selection = animSelect.options[animSelect.selectedIndex].value;
		TestMap.launchAnim(selection);
	});

	scene.add(map.getGroup());
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
	lastMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	lastMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseUp(event) {
	var newX = (event.clientX / window.innerWidth) * 2 - 1;
	var newY = -(event.clientY / window.innerHeight) * 2 + 1;

	if(event.which === 1 && lastMouse.x === newX && lastMouse.y === newY) {
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(map.getGroup().children);
		if(intersects.length > 0) {
			if(selectedMesh) {
				selectedMesh.material.color.set(0x2E4053);
			}
			selectedMesh = intersects[0].object;
			map.updateDisplay(selectedMesh.cubeCoordinates);
			selectedMesh.material.color.set(0xff0000);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {
	renderer.render(scene, camera);
}
