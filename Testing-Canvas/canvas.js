// Moteur physique gérant des balles
function BallEngine(handler, canvas, context) {
	var self = this;
	var _balls = [];
	var _i; // Itérateur pour le parcours des balles

	// Paramètres du moteur physique
	var _ballsAmount = 1;
	var _duplicationMode = false;

	this.setBallsAmount = function(amount) {
		_ballsAmount = amount;
		updateBallsAmount();
	};
	this.setDuplicationMode = function(state) { _duplicationMode = state; };

	// Paramètres des balles
	var _radiusMin = 4;
	var _radiusMax = 30;
	var _speedMin = 2;
	var _speedMax = 10;

	this.setRadiusMin = function(radiusMin) { _radiusMin = radiusMin ; };
	this.setRadiusMax = function(radiusMax) { _radiusMax = radiusMax ; };
	this.setSpeedMin = function(speedMin) { _speedMin = speedMin ; };
	this.setSpeedMax = function(speedMax) { _speedMax = speedMax ; };

	this.getRadiusMin = function() { return _radiusMin; };
	this.getRadiusMax = function() { return _radiusMax };
	this.getSpeedMin = function() { return _speedMin; };
	this.getSpeedMax = function() { return _speedMax; };

	this.update = function() {
		for(_i = _balls.length - 1; _i >= 0; _i--) {
			_balls[_i].update();
			verifyCollisionWithBorders(_balls[_i]);
		}
	};

	this.draw = function() {
		for(var i in _balls) {
			_balls[i].draw();
		}
	};

	// Ajoute une balle instanciée aléatoirement
	var addRandomBall = function() {
		var ball = new Ball(self, canvas, context);
		ball.initRandom();
		_balls.push(ball);
	};

	// Ajoute ou retire des balles en fonction du nombre désirée
	var updateBallsAmount = function() {
		if(_ballsAmount === 1) {
			_balls = [];
			addRandomBall();
			return;
		}

		if(_balls.length < _ballsAmount) {
			var ballsNeeded = _ballsAmount - _balls.length;
			for(var i = 0; i < ballsNeeded; i++) {
				addRandomBall();
			}
		}
		else if(_balls.length > _ballsAmount) {
			var ballsToRemove = _balls.length - _ballsAmount;
			for(var i = 0; i < ballsToRemove; i++) {
				_balls.pop();
			}
		}
	};

	// Supprime une balle et en crée une nouvelle si la balle n'est pas un duplicata
	var removeBall = function(id) {
		if(_balls[id].getIsOriginal()) {
			addRandomBall();
		}
		_balls.splice(id, 1);
	};

	// Duplique une balle en la divisant en deux
	var duplicateBall = function(ball) {
		var newRadius = ball.getRadius() / 2;
		if(newRadius < 0.5) {
			removeBall(_i);
			return;
		}

		ball.setRadius(newRadius);
			
		var duplicata = new Ball(self, canvas, context);
		var d = ball.getDirection(), newDir;

		if(d > 0) newDir = d - Math.PI;
		else if(d < 0) newDir = d + Math.PI;
		else newDir = 0;

		duplicata.setOldXY(ball.getOldX(), ball.getOldY());
		duplicata.setDirection(newDir);
		duplicata.setSpeed(ball.getSpeed());
		duplicata.setRadius(newRadius);
		duplicata.setColor(ball.getColor());
		duplicata.setIsOriginal(false);
		duplicata.updateOld();
		
		_balls.push(duplicata);
	}

	// Post-correction des rebonds sur les bordures
	var verifyCollisionWithBorders = function(ball) {
		var x = ball.getX(), y = ball.getY(), d = ball.getDirection(), s = ball.getSpeed(), r = ball.getRadius();

		if ((x > (canvas.width - r)) || (x < r)) {
			if(_duplicationMode) duplicateBall(ball);

			if(d === Math.PI)
				ball.setDirection(0);
			else if(d > 0)
				ball.setDirection(Math.PI - d);
			else if(d < 0)
				ball.setDirection(-Math.PI - d);
			else 
				ball.setDirection(Math.PI);

			ball.updateOld();
			return true;
		}
		else if ((y > (canvas.height - r)) || (y < r)) {
			if(_duplicationMode) duplicateBall(ball);

			ball.setDirection(-d);

			ball.updateOld();
			return true;
		}

		return false;
	};

	// Init
	updateBallsAmount();
}



