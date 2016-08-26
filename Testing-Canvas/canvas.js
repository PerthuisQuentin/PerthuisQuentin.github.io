/* GESTION DE LA PHYSIQUE DES BALLES */

// Moteur physique gérant des balles
function BallEngine(handler, canvas, context) {
	var self = this;
	var _balls = [];
	var _i; // Itérateur pour le parcours des balles

	// Paramètres du moteur physique
	var _ballsAmount = 1;
	var _duplicationMode = false;

	self.setBallsAmount = function(amount) {
		_ballsAmount = amount;
		updateBallsAmount();
	};
	self.setDuplicationMode = function(state) { _duplicationMode = state; };

	// Paramètres des balles
	var _radiusMin = 4;
	var _radiusMax = 30;
	var _speedMin = 2;
	var _speedMax = 10;

	self.setRadiusMin = function(radiusMin) { _radiusMin = radiusMin ; };
	self.setRadiusMax = function(radiusMax) { _radiusMax = radiusMax ; };
	self.setSpeedMin = function(speedMin) { _speedMin = speedMin ; };
	self.setSpeedMax = function(speedMax) { _speedMax = speedMax ; };

	self.getRadiusMin = function() { return _radiusMin; };
	self.getRadiusMax = function() { return _radiusMax };
	self.getSpeedMin = function() { return _speedMin; };
	self.getSpeedMax = function() { return _speedMax; };

	self.update = function() {
		for(_i = _balls.length - 1; _i >= 0; _i--) {
			_balls[_i].update();
			verifyCollisionWithBorders(_balls[_i]);
		}
	};

	self.draw = function() {
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
	};

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

/* RECTANGLE DE COLLISION */

// Objet représentant un point de coordonnées xy
function Point(x, y) {
	var self = this;
	self._x = x;
	self._y = y;

	// Dessine le point sur "context"
	self.draw = function(context) {
		context.fillStyle = "#000000";
		context.fillRect(self._x, self._y, 1, 1);
	};

	// Déplace le point
	self.move = function(x, y) {
		self._x += x;
		self._y += y;
	};
}

// Objet de collision de boite AABB
function BoundaryAABB(x, y, w, h) {
	var self = this;
	self._x = x;
	self._y = y;
	self._w = w;
	self._h = h;

	// Dessine le rectangle sur "context"
	self.draw = function(context) {
		context.fillStyle = "#000000";
		context.strokeRect(self._x, self._y, self._w, self._h);
	};

	// Déplace le rectangle
	self.move = function(x, y) {
		self._x += x;
		self._y += y;
	};

	// Test si le rectangle contient le point donné
	var containsPoint = function(point) {
		return (
			point._x >= self._x &&
			point._x <= self._x + self._w &&
			point._y >= self._y &&
			point._y <= self._y + self._h
		);
	};

	//  Test si le rectangle contient le rectangle donné
	var containsAABB = function(boundaryAABB) {
		return (
			boundaryAABB._x >= self._x &&
			boundaryAABB._y >= self._y &&
			boundaryAABB._x + boundaryAABB._w <= self._x + self._w &&
			boundaryAABB._y + boundaryAABB._h <= self._y + self._h
		);
	};

	// Test si le rectangle contient le cercle donné
	var containsCircle = function(boundaryCircle) {
		return (
			boundaryCircle._x >= self._x &&
			boundaryCircle._y >= self._y &&
			boundaryCircle._x + boundaryCircle._r <= self._x + self._w &&
			boundaryCircle._y + boundaryCircle._r <= self._y + self._h
		);
	};

	// Test si le rectangle contient un boundary donné
	self.contains = function(boundary) {
		switch(boundary.constructor) {
    		case Point:
        		return containsPoint(boundary);
    		case BoundaryAABB:
        		return containsAABB(boundary);
        	case BoundaryCircle:
        		return containsCircle(boundary);
    		default:
        		return false;
		}
	};

	// Test si le rectangle croise un rectangle donné
	var intersectsAABB = function(boundaryAABB) {
		return !(
			boundaryAABB._x + boundaryAABB._w <= self._x || // Gauche
			boundaryAABB._y + boundaryAABB._h <= self._y || // Haut
			boundaryAABB._x >= self._x + self._w || // Droite
			boundaryAABB._y >= self._y + self._h // Bas
		);
	};

	// Test si le rectangle croise un boundary donné
	self.intersects = function(boundary) {
		switch(boundary.constructor) {
    		case BoundaryAABB:
        		return intersectsAABB(boundary);
        	case BoundaryCircle:
        		return boundary.intersectsAABB(self);
    		default:
        		return false;
		}
	};
}

/* CERCLE DE COLLISION */

// Objet de collision de cercle
function BoundaryCircle(x, y, r) {
	var self = this;
	self._x = x;
	self._y = y;
	self._r = r;

	// Dessine le cercle sur "context"
	self.draw = function(context) {
		context.strokeStyle = "#000000";
		context.beginPath();
		context.arc(self._x, self._y, self._r, 0, Math.PI*2);
    	context.stroke();
		context.closePath();
	};

	// Déplace le cercle
	self.move = function(x, y) {
		self._x += x;
		self._y += y;
	};

	// Test si le cercle contient le point donné
	var containsPoint = function(point) {
		var d = (point._x - self._x) * (point._x - self._x) + 
				(point._y - self._y) * (point._y - self._y);

		return (d <= self._r * self._r);
	};

	// Test si le cercle contient le rectangle donné
	var containsAABB = function(boundaryAABB) {
		return (
			containsPoint(boundaryAABB._x, boundaryAABB._y) &&
			containsPoint(boundaryAABB._x + boundaryAABB._w, boundaryAABB._y) &&
			containsPoint(boundaryAABB._x, boundaryAABB._y + boundaryAABB._h) &&
			containsPoint(boundaryAABB._x + boundaryAABB._w, boundaryAABB._y + boundaryAABB._h)
		);
	};
	
	// Test si le cercle contient le cercle donné
	var containsCircle = function(boundaryCircle) {
		var d = (boundaryCircle._x - self._x) * (boundaryCircle._x - self._x) + 
				(boundaryCircle._y - self._y) * (boundaryCircle._y - self._y);

		return (d <= (self._r - boundaryCircle._r) * (self._r - boundaryCircle._r));
	};

	// Test si le cercle contient un boundary donné
	self.contains = function(boundary) {
		switch(boundary.constructor) {
    		case Point:
        		return containsPoint(boundary);
    		case BoundaryAABB:
        		return containsAABB(boundary);
        	case BoundaryCircle:
        		return containsCircle(boundary);
    		default:
        		return false;
		}
	};

	// Test si le cercle croise un cercle donné
	var intersectsCircle = function(boundaryCircle) {
		var d = (boundaryCircle._x - self._x) * (boundaryCircle._x - self._x) + 
				(boundaryCircle._y - self._y) * (boundaryCircle._y - self._y);

		return (d < (boundaryCircle._r + self._r) * (boundaryCircle._r + self._r));
	};

	// Test si il est possible de projeter le centre du cercle sur un segment AB donné
	var canProjectCenterOnSegment = function(aX, aY, bX, bY) {
		var acX = self._x - aX;
		var acY = self._y - aY;
		var abX = bX - aX;
		var abY = bY - aY;
		var bcX = self._x - bX;
		var bcY = self._y - bY;
		var s1 = (acX * abX) + (acY * abY);
		var s2 = (bcX * abX) + (bcY * abY);
		return !(s1 * s2 > 0);
	}

	// Test si le cercle croise un rectangle donné
	var intersectsAABB = function(boundaryAABB) {
		if(
			boundaryAABB._x + boundaryAABB._w <= self._x - self._r || // Gauche
			boundaryAABB._y + boundaryAABB._h <= self._y - self._r || // Haut
			boundaryAABB._x >= self._x + self._r || // Droite
			boundaryAABB._y >= self._y + self._r // Bas
		) return false;

		// Test d'un coin du rectangle présent dans le cercle
		if(
			self.containsPoint(boundaryAABB._x, boundaryAABB._y) ||
			self.containsPoint(boundaryAABB._x + boundaryAABB._w, boundaryAABB._y) ||
			self.containsPoint(boundaryAABB._x, boundaryAABB._y + boundaryAABB._h) ||
			self.containsPoint(boundaryAABB._x + boundaryAABB._w, boundaryAABB._y + boundaryAABB._h)
		) return true;

		// Test du cercle contenu dans le rectangle
		if(boundaryAABB.containsPoint(self._x, self._y)) return true;

		// Test du cercle traversant un unique segment du rectangle
		var verticalProjection = canProjectCenterOnSegment(boundaryAABB._x, boundaryAABB._y, boundaryAABB._x, boundaryAABB._y + boundaryAABB._h);
		var horizontalProjection = canProjectCenterOnSegment(boundaryAABB._x, boundaryAABB._y, boundaryAABB._x + boundaryAABB._w, boundaryAABB._y);
		if(verticalProjection || horizontalProjection) return true;
		return true;
	};

	// Test si le cercle croise un boundary donné
	self.intersects = function(boundary) {
		switch(boundary.constructor) {
    		case BoundaryAABB:
        		return intersectsAABB(boundary);
        	case BoundaryCircle:
        		return intersectsCircle(self);
    		default:
        		return false;
		}
	};
}

/* QUADTREE */

// Objet de gestion des collisions
function QuadTree(boundaryAABB, depth, maxObjects, maxDepth) {
	var _objects = [];
	var _nodes;
	var _depth = depth;
	this._boundary = boundaryAABB;

	// Dessine le rectangle sur "context"
	self.draw = function(context) {
		context.fillStyle = "#000000";
		context.strokeRect(boundaryAABB._x, boundaryAABB._y, boundaryAABB._w, boundaryAABB._h);
		if(_nodes !== undefined) {
			for(var i in _nodes) {
				_nodes[i].draw(context);
			}
		}
	};	

	// Divise le noeud en 4 noeud
	var subdivide = function() {
		var halfWidth = boundaryAABB._w / 2;
		var halfHeight = boundaryAABB._h / 2;

		var _nodes = [];
		_nodes.push(new QuadTree(new BoundaryAABB(boundaryAABB._x, boundaryAABB._y, halfWidth, halfHeight), _depth + 1, maxObjects, maxDepth));
		_nodes.push(new QuadTree(new BoundaryAABB(boundaryAABB._x + halfWidth, boundaryAABB._y, halfWidth, halfHeight), _depth + 1, maxObjects, maxDepth));
		_nodes.push(new QuadTree(new BoundaryAABB(boundaryAABB._x, boundaryAABB._y + halfHeight, halfWidth, halfHeight), _depth + 1, maxObjects, maxDepth));
		_nodes.push(new QuadTree(new BoundaryAABB(boundaryAABB._x+ halfWidth, boundaryAABB._y + halfHeight, halfWidth, halfHeight), _depth + 1, maxObjects, maxDepth));

		for(var i in _objects) {

		}
	};

	// Ajout un objet "boundary" au noeud
	var insert = function(physicalObject) {
		// Si ce noeud a des noeuds enfants
		if(_nodes !== undefined) {
			for(var i in _nodes) {
				if(_nodes[i]._boundary.intersects(physicalObject._boundary)) {
					_nodes[i].insert(physicalObject);
				}
			}

			return;
		}

		// Si ce noeud n'a pas de noeuds enfants
		_objects.push(physicalObject);

		if(_objects.length > maxObjects && _depth < maxDepth) {
			subdivide();

			for(var i in _objects) {
				for(var y in _nodes) {
					if(_nodes[y]._boundary.intersects(_objects[i]._boundary)) {
					_nodes[y].insert(_objects[i]);
				}
				}
			}
		}
	}
}

