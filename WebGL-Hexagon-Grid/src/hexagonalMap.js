function Point2D(x, z) {
    this.x = x;
    this.z = z;
}

function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function createHexagon(length) {
    var shape = new THREE.Shape();
    shape.moveTo(    -1 * length,                          0);
    shape.lineTo(-(1/2) * length,  (Math.sqrt(3)/2) * length);
    shape.lineTo( (1/2) * length,  (Math.sqrt(3)/2) * length);
    shape.lineTo(     1 * length,                          0);
    shape.lineTo( (1/2) * length, -(Math.sqrt(3)/2) * length);
    shape.lineTo(-(1/2) * length, -(Math.sqrt(3)/2) * length);
    shape.lineTo(    -1 * length,                          0);
    return shape;
}

function HexagonalMap(mapRadius, tileRadius, tileSpacing) {
    var map = {};
    var sceneTilesGroup = new THREE.Group();
    this.getGroup = function() { return sceneTilesGroup; };

    var outerRadius = tileRadius + tileSpacing / 2;
    var innerRadius = outerRadius * Math.sqrt(3) / 2;

    var tileHexagon = createHexagon(tileRadius);
    var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var tileGeometry = new THREE.ExtrudeGeometry(tileHexagon, extrudeSettings);

    var offsetDisplay = document.getElementById('coordinatesOffset');
    var axialDisplay = document.getElementById('coordinatesAxial');
    var cubeDisplay = document.getElementById('coordinatesCube');
    
    var initTile = function(x, y, z) {
        if(!map[x]) map[x] = {};
        if(!map[x][y]) map[x][y] = {};

        var position = cubeToPosition(x, y, z);
        map[x][y][z] = createTile(position.x, position.z, x, y, z);
    };

    var removeTile = function(x, y, z) {
        map[x][y][z].geometry.dispose();
        map[x][y][z].material.dispose();
        sceneTilesGroup.remove(map[x][y][z]);
        delete map[x][y][z];
    };

    this.init = function() {
        map[0] = { 0: { 0: createTile(0, 0, 0, 0, 0) } };
        for(var i = 1; i <= mapRadius; i++) {
            forEachRow(i, initTile);
        }
    };

    this.enableCoordinates = function() {
        sceneTilesGroup.add(sceneCoordinatesGroup);
    };

    this.disableCoordinates = function() {
        sceneTilesGroup.remove(sceneCoordinatesGroup);
    };

    var forEachRow = function(n, callback) {
        callback(0, n, -n); callback(0, -n, n);
        callback(n, 0, -n); callback(-n, 0, n);
        callback(n, -n, 0); callback(-n, n, 0);
        for(var i = 1; i < n; i++) {
            callback(n, -i, i-n); callback(-n, i, n-i);
            callback(-i, n, i-n); callback(i, -n, n-i);
            callback(i-n, -i, n); callback(n-i, i, -n);
        }
    }

    this.addRow = function() {
        forEachRow(++mapRadius, initTile);
    };

    this.removeRow = function() {
        if(mapRadius === 0) return;
        forEachRow(mapRadius--, removeTile);
    };

    var createTile = function(x, z, a, b, c) {
        var mesh = new THREE.Mesh(tileGeometry, new THREE.MeshPhongMaterial({
            color: 0x2E4053,
            transparent: true,
            opacity: 1
        }));
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.position.set(x, -2, z);
        mesh.cubeCoordinates = { x: a, y: b, z: c };
        mesh.customCoord = {};
        sceneTilesGroup.add(mesh);

        return mesh;
    };

    var offsetToPosition = function(x, z) {
        var offset = x % 2 !== 0 ? innerRadius : 0;
        var xPos = x * outerRadius * 1.5;
        var zPos = z * innerRadius * 2 + offset;
        return new Point2D(xPos, zPos);
    };

    var cubeToPosition = function(x, y, z) {
        var offset = cubeToOffset(x, y, z);
        return offsetToPosition(offset.x, offset.z);
    };

    var offsetToAxial = function(x, z) {
        var offset = x % 2 === 0 ? x / 2 : (x - 1) / 2;
        return new Point2D(x, z - offset);
    };

    var axialToCube = function(x, z) {
        return new Point3D(x, -z-x, z);
    };

    var offsetToCube = function(x, z) {
        var offset = (x - Math.abs(x % 2)) / 2;
        return new Point3D(x, - (z - offset) - x, z - offset);
    }

    var cubeToOffset = function(x, y, z) {
        var offset = (x - Math.abs(x % 2)) / 2;
        return new Point2D(x, z + offset);
    }

    this.updateDisplay = function(coordinates) {
        var offset = cubeToOffset(coordinates.x, coordinates.y, coordinates.z);
        var axial = offsetToAxial(offset.x, offset.z);
        offsetDisplay.innerHTML = offset.x + ' / ' + offset.z;
        axialDisplay.innerHTML = axial.x + ' / ' + axial.z;
        cubeDisplay.innerHTML = coordinates.x + ' / ' + coordinates.y + ' / ' + coordinates.z;
    };
}