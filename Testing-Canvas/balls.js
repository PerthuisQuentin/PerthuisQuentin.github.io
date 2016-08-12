// Définition d'un objet représentant une balle
function Ball(handler, canvas, context) {
	this._x = 0; 
	this._y = 0;
	this._direction = 0;
	this._speed = 0;
	this._radius = 1;
	this._color = "#000000";

	this.setX = function(x) { this._x = x; };
	this.setY = function(y) { this._y = y; };
	this.setXY = function(x, y) { this._x = x; this._y = y; };
	this.setDirection = function(direction) { this._direction = direction; };
	this.setSpeed = function(speed) { this._speed = speed; };
	this.setRadius = function(radius) { this._radius = radius; };
	this.setColor = function(color) { this._color = color; };

	// Initialise avec des valeurs aléatoires
	this.initRandom = function() {
		this._radius = Math.floor(Math.random() * (handler._radiusMax - handler._radiusMin)) + handler._radiusMin;
		this._x = Math.floor(Math.random() * (canvas.width - 2*this._radius)) + this._radius;
		this._y = Math.floor(Math.random() * (canvas.height - 2*this._radius)) + this._radius;
		this._direction = (Math.random() * 2 * Math.PI - Math.PI) * -1;
		this._speed = Math.floor(Math.random() * (handler._speedMax - handler._speedMin)) + handler._speedMin;
		this._color = '#' + Math.floor(Math.random()*16777215).toString(16);
	};

	// Desinne la balle dans le canvas
	this.draw = function() {
		// Dessine un cercle
		context.fillStyle = this._color;
		context.beginPath();
		context.arc(this._x, this._y, this._radius, 0, Math.PI*2);
		context.fill();
		context.closePath();
	};
}