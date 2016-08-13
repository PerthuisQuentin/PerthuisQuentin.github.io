window.addEventListener("load", init);

function init() {
	var canvas = document.getElementById('balls-canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}

	// Récupération de la checkbox gérant le mode duplication
	var duplicationCheck = document.getElementById('mode-duplication');
	if(!duplicationCheck) {
		alert("Impossible de récupérer le checkbox de duplication");
		return;
	}

	// Récupération du slider gérant la quantité de balles
	var slider = document.getElementById('balls-slider');
	if(!slider) {
		alert("Impossible de récupérer le slider");
		return;
	}
	
	// Récupération de l'input gérant la quantité de balles
	var input = document.getElementById('balls-input');
	if(!input) {
		alert("Impossible de récupérer l'input");
		return;
	}

	// Instanciation de l'objet qui gérera le balls-canvas
	var ballsCanvas = new BallsCanvas(canvas);

	window.addEventListener("resize", ballsCanvas.resizeCanvas);
	ballsCanvas.resizeCanvas();

	// Evenement au changement d'état de la checkbox du mode duplication
	duplicationCheck.addEventListener("change",
		function(e) {
			ballsCanvas.setDuplicationMode(e.target.checked);
		}
	);

	// Evenement au changement de la valeur du slider
	slider.addEventListener("change", 
		function(e) {
			input.value = e.target.value;
			ballsCanvas.setBallsAmount(e.target.value);
		}
	);
	
	// Evenement au changement de la valeur de l'input
	input.addEventListener("change",
		function(e) {
			var v = Math.round(e.target.value);
			v = v>200?200:v;
			v = v<0?0:v;
			
			e.target.value = v;
			slider.value = v;
			ballsCanvas.setBallsAmount(v);
		}
	);

	ballsCanvas.start();
}

// Objet gérant le balls-canvas
function BallsCanvas(canvas) {
	var context = canvas.getContext('2d');
	var _ballEngine = new BallEngine(this, canvas, context);

	this.start = function() {
		animate();
	};

	this.setDuplicationMode = function(state) {
		_ballEngine.duplicationMode = state;
	};

	this.setBallsAmount = function(amount) {
		_ballEngine.ballsAmount = amount;
	};
	
	// Redimensionne le canvas en fonction de la fenêtre
	this.resizeCanvas = function() {
		canvas.width = window.clientWidth;
		canvas.height = window.clientHeight;
	};

	// Fonction de rafraichissement du canvas
	var animate = function() {
		// Clear du canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		_ballEngine.update();
		_ballEngine.draw();

		requestAnimationFrame(animate);
	};
}