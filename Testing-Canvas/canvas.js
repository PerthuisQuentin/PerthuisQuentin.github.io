// Moteur physique gérant des balles
function BallEngine(handler, canvas, context) {
	var self = this;
	var _balls = [];

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

	this.getRadiusMin = function() { return _radiusMin; };
	this.getRadiusMax = function() { return _radiusMax };
	this.getSpeedMin = function() { return _speedMin; };
	this.getSpeedMax = function() { return _speedMax; };

	this.update = function() {
		for(var i in _balls) {
			_balls[i].update();
			verifyCollisionWithBorders(_balls[i]);
		}
	};

	this.draw = function() {
		for(var i in _balls) {
			_balls[i].draw();
		}
	};

	// Ajoute ou retire des balles en fonction du nombre désirée
	var updateBallsAmount = function() {
		if(_balls.length < _ballsAmount) {
			var ballsNeeded = _ballsAmount - _balls.length;
			for(var i = 0; i < ballsNeeded; i++) {
				var ball = new Ball(self, canvas, context);
				ball.initRandom();
				_balls.push(ball);
			}
		}
		else if(_balls.length > _ballsAmount) {
			var ballsToRemove = _balls.length - _ballsAmount;
			for(var i = 0; i < ballsToRemove; i++) {
				_balls.pop();
			}
		}
	};

	// Dupplique une balle en la divisant en deux
	var duplicateBall = function(ball) {
		var newRadius = ball.getRadius() / 2;
		if(newRadius < 0.5) {
			// TODO : Delete the ball
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

