(function(global){

    "use strict";

    /**
     * Represents an object that orbits in the Solar System
     *
     * A good table of element calculations can be found here:
     * http://www.bogan.ca/orbits/kepler/orbteqtn.html
     */

    global.OrbObj = function(anchor, scalar){

        this.scalar = scalar;
        this.anchor = anchor;
        this.color  = 0x6666cc;

        //draw orbit using osculating orbital elements
        this.drawLineOrbit = function(orbitalElements){

            var scale = this.scalar;
            var eccentricity = orbitalElements[11];
            var semiMajAx = orbitalElements[12];
            var semiMinAx = semiMajAx * Math.sqrt(1-Math.pow(eccentricity,2));

            var argOfPerihelion = orbitalElements[8];
            if(argOfPerihelion < 0) argOfPerihelion + 360;

            var ascendingNode = orbitalElements[9];
            var inclination = orbitalElements[10];

            //calculate the perihelion; q = a (1 - e)
            var perihelion = semiMajAx * (1 - eccentricity);

            var ellipseCurve = new THREE.EllipseCurve(0, 0, semiMajAx*scale, semiMinAx*scale, 0, 2*Math.PI, false);
            var ellipsePath = new THREE.CurvePath();
            ellipsePath.add(ellipseCurve);
            var ellipseGeometry = ellipsePath.createPointsGeometry(100);

            var offset = (semiMajAx - perihelion) * scale;
            var ellipseMat = new THREE.LineBasicMaterial({color:this.color, opacity:.8, linewidth:2, transparent:true});
            var ellipse = new THREE.Line(ellipseGeometry, ellipseMat);
            ellipse.position.x = -(offset);

            var argPeriObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            argPeriObj.add(ellipse);
            argPeriObj.rotation.z = this.degToRad(argOfPerihelion);

            var inclineObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            inclineObj.add(argPeriObj);
            inclineObj.rotation.x = this.degToRad(inclination);

            var ascNodeObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            ascNodeObj.add(inclineObj);
            ascNodeObj.rotation.z = this.degToRad(ascendingNode);

            var center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            center.add(ascNodeObj);
            center.rotation.x = -(Math.PI/2);

            this.anchor.add(center);
        };

        //draw orbit using osculating orbital elements
        this.drawSpecialOrbit = function(orbitalElements){

            var scale = this.scalar;
            var eccentricity = orbitalElements[1];
            var semiMajAx = orbitalElements[0];
            var semiMinAx = semiMajAx * Math.sqrt(1-Math.pow(eccentricity,2));

            var argOfPerihelion = orbitalElements[4];
            if(argOfPerihelion < 0) argOfPerihelion + 360;

            var ascendingNode = orbitalElements[5];
            var inclination = orbitalElements[2];

            //calculate the perihelion; q = a (1 - e)
            var perihelion = semiMajAx * (1 - eccentricity);

            var ellipseCurve = new THREE.EllipseCurve(0, 0, semiMajAx*scale, semiMinAx*scale, 0, 2*Math.PI, false);
            var ellipsePath = new THREE.CurvePath();
            ellipsePath.add(ellipseCurve);
            var ellipseGeometry = ellipsePath.createPointsGeometry(100);

            var offset = (semiMajAx - perihelion) * scale;
            var ellipseMat = new THREE.LineBasicMaterial({color:0x3fa134, opacity:.8, linewidth:2, transparent:true});
            var ellipse = new THREE.Line(ellipseGeometry, ellipseMat);
            ellipse.position.x = -(offset);

            var argPeriObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            argPeriObj.add(ellipse);
            argPeriObj.rotation.z = this.degToRad(argOfPerihelion);

            var inclineObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            inclineObj.add(argPeriObj);
            inclineObj.rotation.x = this.degToRad(inclination);

            var ascNodeObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            ascNodeObj.add(inclineObj);
            ascNodeObj.rotation.z = this.degToRad(ascendingNode);

            var center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00, opacity:0}));
            center.add(ascNodeObj);
            center.rotation.x = -(Math.PI/2);
            center.position.y = 10

            this.anchor.add(center);
        };

        //draw orbit using cartesian state vector
        this.drawPointOrbit = function(orbitalElements){

            // create the particle variables
            var particleCount = orbitalElements.length;
            var particles = new THREE.Geometry();
            var particleMat = new THREE.PointsMaterial({

                color: 0xcc9966,
                size: 100.0
            });

            for(var a = 0; a < particleCount; ++a){

                var pX = (parseFloat(orbitalElements[a][1]) * this.scalar);
                var pY = (parseFloat(orbitalElements[a][2]) * this.scalar);
                var pZ = (parseFloat(orbitalElements[a][3]) * this.scalar);
                var particle = new THREE.Vector3(pX, pY, pZ);
                particles.vertices.push(particle);
            }
            
            var particleSystem = new THREE.Points(particles, particleMat);

            var center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            center.rotation.x = -this.degToRad(90)
            center.add(particleSystem);
            this.anchor.add(center);
        };

        this.degToRad = function(deg){

            return deg/180*Math.PI;
        };
    };
})(this);