// Moteur physique g�rant des balles
function BallEngine(handler, canvas) {
	this._context = canvas.getContext('2d');

	// Param�tres du moteur physique
	this._ballsAmount = 1;
	this._duplicationMode = false;

	// Param�tres des balles
	this._radiusMin = 4;
	this._radiusMax = 30;
	this._speedMin = 2;
	this._speedMax = 10;

	this.init = function() {
		var context = canvas.getContext('2d');
		if(!context) {
			alert("Impossible de r�cup�rer le context du canvas");
			return;
		}


	};

	this.update = function() {

	};

	this.draw = function() {

	};
}

