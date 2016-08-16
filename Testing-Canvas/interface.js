window.addEventListener("load", init);

function init() {
	var canvas = document.getElementById('balls-canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}

	// Instanciation de l'objet qui gérera le balls-canvas
	var ballsCanvas = new BallsCanvas(canvas);

	window.addEventListener("resize", ballsCanvas.resizeCanvas);
	ballsCanvas.resizeCanvas();

	/* PARAMETRES DES MODES */

	// Récupération de la checkbox gérant le mode duplication
	var duplicationCheck = document.getElementById('mode-duplication');
	if(!duplicationCheck) {
		alert("Impossible de récupérer le checkbox de duplication");
		return;
	}

	// Evenement au changement d'état de la checkbox du mode duplication
	duplicationCheck.addEventListener("change",
		function(e) {
			ballsCanvas.setDuplicationMode(e.target.checked);
		}
	);

	/* PARAMETRES DE QUANTITE DE BALLES */ 

	// Récupération du slider gérant la quantité de balles
	var amountSlider = document.getElementById('amount-slider');
	if(!amountSlider) {
		alert("Impossible de récupérer le slider de quantité des balles");
		return;
	}

	// Récupération de l'input gérant la quantité de balles
	var amountInput = document.getElementById('amount-input');
	if(!amountInput) {
		alert("Impossible de récupérer l'input de quantité des balles");
		return;
	}

	var amountMin = 1, amountMax = 200;
	amountSlider.min = amountMin;
	amountSlider.max = amountMax;
	amountSlider.step = 1;
	amountInput.value = amountMin;

	// Slider de quantité de balles custom avec NoUiSlider
	noUiSlider.create(amountSlider, {
		connect: 'lower',
		start: [ amountMin ],
		step: 1,
		range: {
			'min': [ amountMin ],
			'max': [ amountMax ]
		}
	});

	// Evenement au changement de la valeur du slider de quantité de balles
	amountSlider.noUiSlider.on("change", 
		function(e) {
			var v = Math.round(amountSlider.noUiSlider.get());
			amountInput.value = v;
			ballsCanvas.setBallsAmount(v);
		}
	);

	// Evenement au changement de la valeur de l'input de quantité de balles
	amountInput.addEventListener("change",
		function(e) {
			// amountMin <= v <= amountMax (Integer)
			var v = Math.round(parseInt(amountInput.value));
			v = v>amountMax?amountMax:v;
			v = v<amountMin?amountMin:v;
			
			amountInput.value = v;
			amountSlider.noUiSlider.set(v);
			ballsCanvas.setBallsAmount(v);
		}
	);

	/* PARAMETRES DE TAILLE DES BALLES */

	// Récupération du slider gérant la taille des balles
	var radiusSlider = document.getElementById('radius-slider');
	if(!radiusSlider) {
		alert("Impossible de récupérer le slider de taille des balles");
		return;
	}

	// Récupération de l'input gérant la taille min des balles
	var radiusInputMin = document.getElementById('radius-input-min');
	if(!radiusInputMin) {
		alert("Impossible de récupérer l'input de taille min des balles");
		return;
	}

	// Récupération de l'input gérant la taille max des balles
	var radiusInputMax = document.getElementById('radius-input-max');
	if(!radiusInputMax) {
		alert("Impossible de récupérer l'input de taille max des balles");
		return;
	}

	var radiusMin = 4, radiusMax = 30;
	radiusInputMin.value = radiusMin;
	radiusInputMax.value = radiusMax;

	// Slider de taille des balles custom avec NoUiSlider
	noUiSlider.create(radiusSlider, {
		connect: true,
		start: [ radiusMin, radiusMax ],
		step: 1,
		range: {
			'min': [ radiusMin ],
			'max': [ radiusMax ]
		}
	});

	// Evenement au changement de la valeur du slider de taille des balles
	radiusSlider.noUiSlider.on("change", 
		function() {
			var v = radiusSlider.noUiSlider.get();
			radiusInputMin.value = Math.round(v[0]);
			radiusInputMax.value = Math.round(v[1]);
			ballsCanvas.setBallsRadius(parseInt(radiusInputMin.value), parseInt(radiusInputMax.value));
		}
	);

	// Evenement au changement de la valeur de l'input min de taille des balles
	radiusInputMin.addEventListener("change",
		function() {
			// radiusMin <= v <= radiusMax (Integer)
			var v = Math.round(parseInt(radiusInputMin.value));
			v = v>radiusMax?radiusMax:v;
			v = v<radiusMin?radiusMin:v;
			
			radiusInputMin.value = v;
			radiusSlider.noUiSlider.set([v, null]);
			ballsCanvas.setBallsRadius(parseInt(radiusInputMin.value), parseInt(radiusInputMax.value));
		}
	);

	// Evenement au changement de la valeur de l'input max de taille des balles
	radiusInputMax.addEventListener("change",
		function() {
			// radiusMin <= v <= radiusMax (Integer)
			var v = Math.round(parseInt(radiusInputMax.value));
			v = v>radiusMax?radiusMax:v;
			v = v<radiusMin?radiusMin:v;
			
			radiusInputMax.value = v;
			radiusSlider.noUiSlider.set([null, v]);
			ballsCanvas.setBallsRadius(parseInt(radiusInputMin.value), parseInt(radiusInputMax.value));
		}
	);

	ballsCanvas.setBallsRadius(parseInt(radiusInputMin.value), parseInt(radiusInputMax.value));

	/* PARAMETRES DE VITESSE DES BALLES */

	// Récupération du slider gérant la vitesse des balles
	var speedSlider = document.getElementById('speed-slider');
	if(!speedSlider) {
		alert("Impossible de récupérer le slider de vitesse des balles");
		return;
	}

	// Récupération de l'input gérant la vitesse min des balles
	var speedInputMin = document.getElementById('speed-input-min');
	if(!speedInputMin) {
		alert("Impossible de récupérer l'input de vitesse min des balles");
		return;
	}

	// Récupération de l'input gérant la vitesse max des balles
	var speedInputMax = document.getElementById('speed-input-max');
	if(!speedInputMax) {
		alert("Impossible de récupérer l'input de vitesse max des balles");
		return;
	}

	var speedMin = 2, speedMax = 10;
	speedInputMin.value = speedMin;
	speedInputMax.value = speedMax;

	// Slider de vitesse des balles custom avec NoUiSlider
	noUiSlider.create(speedSlider, {
		connect: true,
		start: [ speedMin, speedMax ],
		step: 1,
		range: {
			'min': [ speedMin ],
			'max': [ speedMax ]
		}
	});

	// Evenement au changement de la valeur du slider de vitesse des balles
	speedSlider.noUiSlider.on("change", 
		function() {
			var v = speedSlider.noUiSlider.get();
			speedInputMin.value = Math.round(v[0]);
			speedInputMax.value = Math.round(v[1]);
			ballsCanvas.setBallsSpeed(parseInt(speedInputMin.value), parseInt(speedInputMax.value));
		}
	);

	// Evenement au changement de la valeur de l'input min de vitesse des balles
	speedInputMin.addEventListener("change",
		function() {
			// speedMin <= v <= speedMax (Integer)
			var v = Math.round(parseInt(speedInputMin.value));
			v = v>speedMax?speedMax:v;
			v = v<speedMin?speedMin:v;
			
			speedInputMin.value = v;
			speedSlider.noUiSlider.set([v, null]);
			ballsCanvas.setBallsSpeed(parseInt(speedInputMin.value), parseInt(speedInputMax.value));
		}
	);

	// Evenement au changement de la valeur de l'input max de vitesse des balles
	speedInputMax.addEventListener("change",
		function() {
			// speedMin <= v <= speedMax (Integer)
			var v = Math.round(parseInt(speedInputMax.value));
			v = v>speedMax?speedMax:v;
			v = v<speedMin?speedMin:v;
			
			speedInputMax.value = v;
			speedSlider.noUiSlider.set([null, v]);
			ballsCanvas.setBallsSpeed(parseInt(speedInputMin.value), parseInt(speedInputMax.value));
		}
	);

	ballsCanvas.setBallsSpeed(parseInt(speedInputMin.value), parseInt(speedInputMax.value));

	ballsCanvas.start();
}

var test = [];

// Objet gérant le balls-canvas
function BallsCanvas(canvas) {
	var self = this;
	var _context = canvas.getContext('2d');
	var _ballEngine = new BallEngine(self, canvas, _context);
	var _started = false;

	this.start = function() {
		if(!_started) {
			animate();
			_started = true;
		}
	}

	this.setDuplicationMode = function(state) {
		_ballEngine.setDuplicationMode(state);
	};

	this.setBallsAmount = function(amount) {
		_ballEngine.setBallsAmount(amount);
	};

	this.setBallsRadius = function(radiusMin, radiusMax) {
		_ballEngine.setRadiusMin(radiusMin);
		_ballEngine.setRadiusMax(radiusMax);
	};

	this.setBallsSpeed = function(speedMin, speedMax) {
		_ballEngine.setSpeedMin(speedMin);
		_ballEngine.setSpeedMax(speedMax);
	};
	
	// Redimensionne le canvas en fonction de la fenêtre
	this.resizeCanvas = function() {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	};

	// Fonction de rafraichissement du canvas
	var animate = function() {
		// Clear du canvas
		_context.clearRect(0, 0, canvas.width, canvas.height);

		_ballEngine.update();
		_ballEngine.draw();

		for(var i in test) {
			test[i].draw(_context);
		}

		requestAnimationFrame(animate);
	};
}