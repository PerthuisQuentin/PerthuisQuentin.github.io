// Moteur physique gérant des balles
function BallEngine(handler, canvas) {
	this._context = canvas.getContext('2d');

	// Paramètres du moteur physique
	this._ballsAmount = 1;
	this._duplicationMode = false;

	// Paramètres des balles
	this._radiusMin = 4;
	this._radiusMax = 30;
	this._speedMin = 2;
	this._speedMax = 10;

	this.init = function() {
		var context = canvas.getContext('2d');
		if(!context) {
			alert("Impossible de récupérer le context du canvas");
			return;
		}


	};

	this.update = function() {

	};

	this.draw = function() {

	};
}

