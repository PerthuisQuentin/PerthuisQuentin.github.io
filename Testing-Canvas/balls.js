// Définition d'un objet représentant une balle
function Ball(handler, canvas, context) {
	var self = this;
	var _x = 0; 
	var _y = 0;
	var _oldX = 0;
	var _oldY = 0;
	var _direction = 0;
	var _speed = 0;
	var _radius = 1;
	var _color = "#000000";
	var _isOriginal = true;


	self.setX = function(x) { _x = x; };
	self.setY = function(y) { _y = y; };
	self.setXY = function(x, y) { _x = x; _y = y; };
	self.setOldX = function(x) { _oldX = x; };
	self.setOldY = function(y) { _oldY = y; };
	self.setOldXY = function(x, y) { _oldX = x; _oldY = y; };
	self.setDirection = function(direction) { _direction = direction; };
	self.setSpeed = function(speed) { _speed = speed; };
	self.setRadius = function(radius) { _radius = radius; };
	self.setColor = function(color) { _color = color; };
	self.setIsOriginal = function(state) { _isOriginal = state; };

	self.getX = function() { return _x; };
	self.getY = function() { return _y; };
	self.getOldX = function() { return _oldX; };
	self.getOldY = function() { return _oldY; };
	self.getDirection = function() { return _direction; };
	self.getSpeed = function() { return _speed; };
	self.getRadius = function() { return _radius; };
	self.getColor = function() { return _color; };
	self.getIsOriginal = function() { return _isOriginal; };

	// Initialise avec des valeurs aléatoires
	self.initRandom = function() {
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
	self.draw = function() {
		// Dessine un cercle
		context.fillStyle = _color;
		context.beginPath();
		context.arc(_x, _y, _radius, 0, Math.PI*2);
		context.fill();
		context.closePath();
	};

	// Mets à jour les informations de la balle
	self.update = function() {
		_oldX = _x;
		_oldY = _y;
		_x += Math.cos(_direction) * _speed;
		_y += Math.sin(_direction) * _speed;
	};

	// Mets à jour les informations de la balle à partir de la position précédente
	self.updateOld = function() {
		_x = _oldX + Math.cos(_direction) * _speed;
		_y = _oldY + Math.sin(_direction) * _speed;
	};
}