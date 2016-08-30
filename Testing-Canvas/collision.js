/* OBJET DE COLLISION */

function Boundary(x, y) {
	var self = this;
	self._x = x;
	self._y = y;

	// Dessine le boundary sur "context"
	self.draw = function(context) {
		context.fillStyle = "#000000";
		context.fillRect(self._x, self._y, 1, 1);
	};

	// Déplace le boundary
	self.move = function(x, y) {
		self._x += x;
		self._y += y;
	};
}

/* POINT DE COLLISION */

// Objet représentant un point de coordonnées xy
function BoundaryPoint(x, y) {
	var self = this;
	self._x = x;
	self._y = y;

	self.contains = function(boundary) {
		return false;
	}

	self.intersects = function(boundary) {
		return boundary.contains(self);
	}
}

// Hérite de Boundary
BoundaryPoint.prototype = new Boundary();

/* RECTANGLE DE COLLISION */

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

// Hérite de Boundary
BoundaryAABB.prototype = new Boundary();

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

// Hérite de Boundary
BoundaryCircle.prototype = new Boundary();