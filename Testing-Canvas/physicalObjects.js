/* OBJET PHYSIQUE */

function physicalObject() {
	var self = this;
	var _boundary = new BoundaryPoint(0, 0);
}

/* BALLES */

// Définition d'un objet représentant une balle
function Ball(handler, canvas, context) {
	var self = this;
	var _boundary = new BoundaryCircle(0, 0, 1);
	var _oldX = 0;
	var _oldY = 0;
	var _direction = 0;
	var _speed = 0;
	var _color = "#000000";
	var _isOriginal = true;


	self.setX = function(x) { _boundary._x = x; };
	self.setY = function(y) { _boundary._y = y; };
	self.setRadius = function(radius) { _boundary._r = radius; };
	self.setXY = function(x, y) { _boundary._x = x; _boundary._y = y; };

	self.setOldX = function(x) { _oldX = x; };
	self.setOldY = function(y) { _oldY = y; };
	self.setOldXY = function(x, y) { _oldX = x; _oldY = y; };
	self.setDirection = function(direction) { _direction = direction; };
	self.setSpeed = function(speed) { _speed = speed; };
	self.setColor = function(color) { _color = color; };
	self.setIsOriginal = function(state) { _isOriginal = state; };

	self.getX = function() { return _boundary._x; };
	self.getY = function() { return _boundary._y; };
	self.getRadius = function() { return _boundary._r; };
	self.getBoundary = function() { return _boundary; };

	self.getOldX = function() { return _oldX; };
	self.getOldY = function() { return _oldY; };
	self.getDirection = function() { return _direction; };
	self.getSpeed = function() { return _speed; };
	self.getColor = function() { return _color; };
	self.getIsOriginal = function() { return _isOriginal; };

	// Initialise avec des valeurs aléatoires
	self.initRandom = function() {
		_boundary._r = Math.floor(Math.random() * (handler.getRadiusMax() - handler.getRadiusMin())) + handler.getRadiusMin();
		_boundary._x = Math.floor(Math.random() * (canvas.width - 2*_boundary._r)) + _boundary._r;
		_boundary._y = Math.floor(Math.random() * (canvas.height - 2*_boundary._r)) + _boundary._r;
		_oldX = _boundary._x;
		_oldY = _boundary._y;
		_direction = (Math.random() * 2 * Math.PI - Math.PI) * -1;
		_speed = Math.floor(Math.random() * (handler.getSpeedMax() - handler.getSpeedMin())) + handler.getSpeedMin();
		_color = '#' + Math.floor(Math.random()*16777215).toString(16);
		_isOriginal = true;
	};

	// Desinne la balle dans le canvas
	self.draw = function() {
		// Dessine un cercle
		context.fillStyle = _color;
		context.beginPath();
		context.arc(_boundary._x, _boundary._y, _boundary._r, 0, Math.PI*2);
		context.fill();
		context.closePath();
	};

	// Mets à jour les informations de la balle
	self.update = function() {
		_oldX = _boundary._x;
		_oldY = _boundary._y;
		_boundary._x += Math.cos(_direction) * _speed;
		_boundary._y += Math.sin(_direction) * _speed;
	};

	// Mets à jour les informations de la balle à partir de la position précédente
	self.updateOld = function() {
		_boundary._x = _oldX + Math.cos(_direction) * _speed;
		_boundary._y = _oldY + Math.sin(_direction) * _speed;
	};
}