(function(global){

    "use strict";

    /**
     * Represents an object that orbits in the Solar System
     *
     * A good table of element calculations can be found here:
     * http://www.bogan.ca/orbits/kepler/orbteqtn.html
     */

    global.OrbObj = function(anchor, scalar, color){

        this.scalar = scalar;
        this.anchor = anchor;
        this.color  = color;

        //draw orbit using osculating orbital elements
        this.drawLineOrbit = function(orbitalElements){

            var scale = this.scalar;

            var semiMajAx       = orbitalElements[0]; // Semi-Major Axis
            var eccentricity    = orbitalElements[1]; // Eccentricity
            var inclination     = orbitalElements[2]; // Inclination
            var argOfPerihelion = orbitalElements[3]; // Argument of Perihelion
            var ascendingNode   = orbitalElements[4]; // Longitude of Acending Node

            //calculate some other variables we will need
            if(argOfPerihelion < 0) argOfPerihelion + 360;
            var perihelion = semiMajAx * (1 - eccentricity);
            var semiMinAx = semiMajAx * Math.sqrt(1-Math.pow(eccentricity,2));

            /**
             * The best way to "read" the mechanics of this is from the BOTTOM UP
             * Remember we are referenced to the Eliptic Reference Frame, see README.md
             */

            //Draw out the ellipse
            var ellipseCurve = new THREE.EllipseCurve(0, 0, semiMajAx*scale, semiMinAx*scale, 0, 2*Math.PI, false);
            var ellipsePath = new THREE.CurvePath();
            ellipsePath.add(ellipseCurve);
            var ellipseGeometry = ellipsePath.createPointsGeometry(100);

            //Shift the orbits center relative to the Solar System Center.
            //i.e. Set the correct distance of the perihelion
            var offset = (semiMajAx - perihelion) * scale;
            var ellipseMat = new THREE.LineBasicMaterial({color:this.color, opacity:.8, linewidth:2, transparent:true});
            var ellipse = new THREE.Line(ellipseGeometry, ellipseMat);
            ellipse.position.x = -(offset);

            //Rotate the orbital by the Argument of Perihelion
            var argPeriObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            argPeriObj.add(ellipse);
            argPeriObj.rotation.z = this.degToRad(argOfPerihelion);

            //Tilt the orbital around the X axis by the incliation 
            var inclineObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            inclineObj.add(argPeriObj);
            inclineObj.rotation.x = this.degToRad(inclination);

            //Rotate around the Z axis for the Longitude of the Acending Node
            var ascNodeObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            ascNodeObj.add(inclineObj);
            ascNodeObj.rotation.z = this.degToRad(ascendingNode);

            //Add a centering point for the solar system
            var center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));
            center.add(ascNodeObj);
            center.rotation.x = -(Math.PI/2);

            this.anchor.add(center);
        };

        //draw orbit using cartesian state vector
        this.drawPointOrbit = function(orbitalElements){

            // create the particle variables
            var particleCount = orbitalElements.length;
            var particles = new THREE.Geometry();
            var particleMat = new THREE.PointsMaterial({

                color: this.color,
                size: 1.0
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