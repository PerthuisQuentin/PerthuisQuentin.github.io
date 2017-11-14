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
    
    var animState = "visible";
    var animations = {
		appear: new TimelineLite().pause(),
        disappear: new TimelineLite().pause(),
        wave: new TimelineLite().pause()
    };

    var initTile = function(x, y, z, row) {
        if(!map[x]) map[x] = {};
        if(!map[x][y]) map[x][y] = {};

        var position = cubeToPosition(x, y, z);
        map[x][y][z] = createTile(position.x, position.z, x, y, z, row);
    };

    var createTile = function(x, z, a, b, c, row) {
        var mesh = new THREE.Mesh(tileGeometry, new THREE.MeshPhongMaterial({
            color: 0x2E4053,
            transparent: true,
            opacity: 1
        }));
        animations.appear.fromTo(mesh.position, 1, { y: -100 }, { y: 10, ease: Elastic.easeOut.config(1, 0.3) }, row * 0.5);
        animations.appear.fromTo(mesh.material, 1, { opacity: 0 }, { opacity: 1 }, row * 0.5);
        animations.disappear.fromTo(mesh.position, 0.5, { y: 0 }, { y: -100 }, row * 0.2);
        animations.disappear.fromTo(mesh.material, 0.5, { opacity: 1 }, { opacity: 0 }, row * 0.2);
        animations.wave.fromTo(mesh.position, 0.5, { y: 0 }, { y: 20, ease: Power1.easeOut }, row * 0.2);
        animations.wave.to(mesh.position, 0.5, { y: 0, ease: Power1.easeOut }, 0.5 + row * 0.2);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.position.set(x, 0, z);
        mesh.cubeCoordinates = { x: a, y: b, z: c };
        mesh.customCoord = {};
        if(animState == "visible") {
            mesh.position.y = 0;
            mesh.material.opacity = 1;
        } else if(animState == "hidden") {
            mesh.position.y = -100;
            mesh.material.opacity = 0;
        }
        sceneTilesGroup.add(mesh);

        return mesh;
    };

    var removeTile = function(x, y, z) {
        animations.appear.remove(animations.appear.getTweensOf(map[x][y][z].position));
        animations.appear.remove(animations.appear.getTweensOf(map[x][y][z].material));
        animations.disappear.remove(animations.disappear.getTweensOf(map[x][y][z].position));
        animations.disappear.remove(animations.disappear.getTweensOf(map[x][y][z].material));
        animations.wave.remove(animations.wave.getTweensOf(map[x][y][z].position));
        map[x][y][z].geometry.dispose();
        map[x][y][z].material.dispose();
        sceneTilesGroup.remove(map[x][y][z]);
        delete map[x][y][z];
    };

    this.init = function() {
        map[0] = { 0: { 0: createTile(0, 0, 0, 0, 0, 0) } };
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
        callback(0, n, -n, n); callback(0, -n, n, n);
        callback(n, 0, -n, n); callback(-n, 0, n, n);
        callback(n, -n, 0, n); callback(-n, n, 0, n);
        for(var i = 1; i < n; i++) {
            callback(n, -i, i-n, n); callback(-n, i, n-i, n);
            callback(-i, n, i-n, n); callback(i, -n, n-i, n);
            callback(i-n, -i, n, n); callback(n-i, i, -n, n);
        }
    }

    this.addRow = function() {
        forEachRow(++mapRadius, initTile);
    };

    this.removeRow = function() {
        if(mapRadius === 0) return;
        forEachRow(mapRadius--, removeTile);
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

    this.launchAnim = function(anim) {
        if(anim == "appear") {
            animState = "visible";
        } else if(anim == "disappear") {
            animState = "hidden";
        }
        animations[anim].restart();
    };
}