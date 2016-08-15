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
			var v = Math.round(amountInput.value);
			v = v>amountMax?amountMax:v;
			v = v<amountMin?amountMin:v;
			
			amountInput.value = v;
			amountSlider.noUiSlider.set(v);
			ballsCanvas.setBallsAmount(v);
		}
	);







	ballsCanvas.start();
}

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

		requestAnimationFrame(animate);
	};
}