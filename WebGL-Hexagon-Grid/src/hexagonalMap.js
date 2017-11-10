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
    var sceneCoordinatesGroup = new THREE.Group();
    this.getGroup = function() { return sceneTilesGroup; };

    var outerRadius = tileRadius + tileSpacing / 2;
    var innerRadius = outerRadius * Math.sqrt(3) / 2;

    var tileHexagon = createHexagon(tileRadius);
    var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var tileGeometry = new THREE.ExtrudeGeometry(tileHexagon, extrudeSettings);
    var material = new THREE.MeshPhongMaterial({
		color: 0x2E4053,
		transparent: true,
		opacity: 1
    });
    var font;
    var red = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    var blue = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    var green = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    this.setFont = function(_font) {
        font = _font;
    };
    
    this.init = function() {
        for(var x = -mapRadius; x <= mapRadius; x++) {
            for(var y = -mapRadius; y <= mapRadius; y++) {
                for(var z = -mapRadius; z <= mapRadius; z++) {
                    if((x + y + z) !== 0) continue;

                    if(!map[x]) map[x] = {};
                    if(!map[x][y]) map[x][y] = {};

                    var position = cubeToPosition(x, y, z);
                    map[x][y][z] = createTile(position.x, position.z, x, y, z);
                }
            }
        }
    };

    this.enableCoordinates = function() {
        sceneTilesGroup.add(sceneCoordinatesGroup);
    };

    this.disableCoordinates = function() {
        sceneTilesGroup.remove(sceneCoordinatesGroup);
    };

    this.addRow = function() {
        mapRadius++;
        for(var x = -mapRadius; x <= mapRadius; x++) {
            for(var y = -mapRadius; y <= mapRadius; y++) {
                for(var z = -mapRadius; z <= mapRadius; z++) {
                    if((x + y + z) !== 0) continue;
                    if(Math.abs(x) !== mapRadius && Math.abs(y) !== mapRadius && Math.abs(z) !== mapRadius) continue;

                    if(!map[x]) map[x] = {};
                    if(!map[x][y]) map[x][y] = {};

                    var position = cubeToPosition(x, y, z);
                    map[x][y][z] = createTile(position.x, position.z, x, y, z);
                }
            }
        }
    };

    this.removeRow = function() {
        if(mapRadius === 0) return; 
        for(var x = -mapRadius; x <= mapRadius; x++) {
            for(var y = -mapRadius; y <= mapRadius; y++) {
                for(var z = -mapRadius; z <= mapRadius; z++) {
                    if((x + y + z) !== 0) continue;
                    if(Math.abs(x) !== mapRadius && Math.abs(y) !== mapRadius && Math.abs(z) !== mapRadius) continue;

                    var mesh = map[x][y][z];
                    for(var i in mesh.customCoord) {
                        mesh.customCoord[i].geometry.dispose();
                        mesh.customCoord[i].material.dispose();
                        sceneCoordinatesGroup.remove(mesh.customCoord[i]);
                    }
                    map[x][y][z].geometry.dispose();
                    map[x][y][z].material.dispose();
                    sceneTilesGroup.remove(map[x][y][z]);
                    delete map[x][y][z];
                }
            }
        }
        mapRadius--;
    };

    var createTile = function(x, z, a, b, c) {
        var mesh = new THREE.Mesh(tileGeometry, material);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.position.set(x, -2, z);
        mesh.customCoord = {};
        sceneTilesGroup.add(mesh);

        var dist = 30;
        if(b === false) dist = 15;

        if(a !== false) {
            var xGeom = new THREE.TextGeometry(a.toString(), font);
            xGeom.center();
            var xMesh = new THREE.Mesh(xGeom, blue);
            xMesh.rotation.set(Math.PI / 2, Math.PI, 0);
            xMesh.position.set(x + dist, 1, z);
            mesh.customCoord.x = xMesh;
            sceneCoordinatesGroup.add(xMesh);
        }
        if(b !== false) {
            var yGeom = new THREE.TextGeometry(b.toString(), font);
            yGeom.center();
            var yMesh = new THREE.Mesh(yGeom, green);
            yMesh.rotation.set(Math.PI / 2, Math.PI, 0);
            yMesh.position.set(x, 1, z);
            mesh.customCoord.y = yMesh;
            sceneCoordinatesGroup.add(yMesh);
        }
        if(c !== false) {
            var zGeom = new THREE.TextGeometry(c.toString(), font);
            zGeom.center();
            var zMesh = new THREE.Mesh(zGeom, red);
            zMesh.rotation.set(Math.PI / 2, Math.PI, 0);
            zMesh.position.set(x - dist, 1, z);
            mesh.customCoord.z = zMesh;
            sceneCoordinatesGroup.add(zMesh);
        }

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
}