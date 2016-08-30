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
