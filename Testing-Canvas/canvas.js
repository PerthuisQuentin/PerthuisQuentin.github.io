// Moteur physique gérant des balles
function BallEngine(handler, canvas, context) {
	// Paramètres du moteur physique
	var _ballsAmount = 1;
	var _duplicationMode = false;

	// Paramètres des balles
	var _radiusMin = 4;
	var _radiusMax = 30;
	var _speedMin = 2;
	var _speedMax = 10;

	this.getRadiusMin = function() { return _radiusMin; };
	this.getRadiusMax = function() { return _radiusMax };
	this.getSpeedMin = function() { return _speedMin; };
	this.getSpeedMax = function() { return _speedMax; };


	this.update = function() {

	};

	this.draw = function() {

	};
}

