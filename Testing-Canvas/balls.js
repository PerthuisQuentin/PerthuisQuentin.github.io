// Définition d'un objet représentant une balle
function Ball(handler, canvas, context) {
	var _x = 0; 
	var _y = 0;
	var _oldX = 0;
	var _oldY = 0;
	var _direction = 0;
	var _speed = 0;
	var _radius = 1;
	var _color = "#000000";
	var _isOriginal = true;


	this.setX = function(x) { _x = x; };
	this.setY = function(y) { _y = y; };
	this.setXY = function(x, y) { _x = x; _y = y; };
	this.setOldX = function(x) { _oldX = x; };
	this.setOldY = function(y) { _oldY = y; };
	this.setOldXY = function(x, y) { _oldX = x; _oldY = y; };
	this.setDirection = function(direction) { _direction = direction; };
	this.setSpeed = function(speed) { _speed = speed; };
	this.setRadius = function(radius) { _radius = radius; };
	this.setColor = function(color) { _color = color; };
	this.setIsOriginal = function(state) { _isOriginal = state; };

	this.getX = function() { return _x; };
	this.getY = function() { return _y; };
	this.getOldX = function() { return _oldX; };
	this.getOldY = function() { return _oldY; };
	this.getDirection = function() { return _direction; };
	this.getSpeed = function() { return _speed; };
	this.getRadius = function() { return _radius; };
	this.getColor = function() { return _color; };
	this.getIsOriginal = function() { return _isOriginal; };

	// Initialise avec des valeurs aléatoires
	this.initRandom = function() {
		_radius = Math.floor(Math.random() * (handler.getRadiusMax() - handler.getRadiusMin())) + handler.getRadiusMin();
		_x = Math.floor(Math.random() * (canvas.width - 2*_radius)) + _radius;
		_y = Math.floor(Math.random() * (canvas.height - 2*_radius)) + _radius;
		_oldX = _x;
		_oldY = _y;
		_direction = (Math.random() * 2 * Math.PI - Math.PI) * -1;
		_speed = Math.floor(Math.random() * (handler.getSpeedMax() - handler.getSpeedMin())) + handler.getSpeedMin();
		_color = '#' + Math.floor(Math.random()*16777215).toString(16);
		_isOriginal = true;
	};

	// Desinne la balle dans le canvas
	this.draw = function() {
		// Dessine un cercle
		context.fillStyle = _color;
		context.beginPath();
		context.arc(_x, _y, _radius, 0, Math.PI*2);
		context.fill();
		context.closePath();
	};

	// Mets à jour les informations de la balle
	this.update = function() {
		_oldX = _x;
		_oldY = _y;
		_x += Math.cos(_direction) * _speed;
		_y += Math.sin(_direction) * _speed;
	};

	// Mets à jour les informations de la balle à partir de la position précédente
	this.updateOld = function() {
		_x = _oldX + Math.cos(_direction) * _speed;
		_y = _oldY + Math.sin(_direction) * _speed;
	};
}