(function(global){

    var Planet = Backbone.Model.extend({

        defaults : {
            name : "planet",
            color: 0x00ff00,
            aphelion : 1,//in AU
            perihelion : 1,//in AU
            majorAxis : 1,//in AU
            eccentricity : 0,
            inclination : 0,//to ecliptic
            ascendingNode : 0,
            anchor : null,
            argOfPerihelion : 0,
            planetSprite : null
        },

        initialize : function(){

            this.drawOrbit();
        },

        setPosition : function(xPos, yPos, zPos){

            var planet = this.get("planetSprite")
            planet.position.x = xPos;
            planet.position.y = yPos;
            planet.position.z = zPos;
        },

        drawOrbit : function(){

            //(Center_Xpos, Center_Ypos, Xradius, Yradius, StartAngle, EndAngle, isClockwise)
            var scale = System.scalar;
            var eccen = this.get("eccentricity");
            var majAx = this.get("majorAxis");
            var minAx = majAx * Math.sqrt(1-Math.pow(eccen,2));

            //render the ellipse of the orbit, calc the major and minor axes 
            var ellipse = new THREE.EllipseCurve(0, 0, minAx*scale, majAx*scale, 0, 2.0*Math.PI, false);
            var ellipsePath = new THREE.CurvePath();
            ellipsePath.add(ellipse);
            var ellipseGeometry = ellipsePath.createPointsGeometry(100);
            ellipseGeometry.computeTangents();

            //draw the ellipse and tilt the orbital plane for the inclination to the ecliptic 
            var material = new THREE.LineBasicMaterial({color:this.get("color"), opacity:.8, linewidth:2, transparent:true});
            var orbit = new THREE.Line(ellipseGeometry, material);
            orbit.rotation.x = degToRad(90 + this.get("inclination"));

            //rotate the orbit so the acending node crosses the ecliptic at the right position
            var center = new THREE.Mesh(new THREE.Geometry(), new THREE.Material());
            center.rotation.y = degToRad(this.get("ascendingNode"));

            //offset the origin of the orbit for the argument of the perihelion
            var offsetRadius = majAx - this.get("perihelion");
            
            var argPeri = this.get("argOfPerihelion");
            var argPeri = degToRad(argPeri)//in radians
            var xOffset = offsetRadius * Math.cos(argPeri);
            var yOffset = offsetRadius * Math.sin(argPeri);
            center.position.x = -(xOffset*scale);
            center.position.z = yOffset*scale;//z = y, is due to the coordinate system conversion

            center.add(orbit);
            this.get("anchor").add(center);
        },

        drawPlanet : function(){

            var planetMaterial = new THREE.MeshBasicMaterial({color:this.get("color"), wireframe:false, transparent:true, overdraw:true});
            this.set("planetSprite", new THREE.Mesh(new THREE.SphereGeometry(3, 12, 24), planetMaterial));
            this.get("anchor").add(this.get("planetSprite"));
        }
    });

    global.System = {

        debug : false,//turn on the uv map and axis helpers
        scalar : 80,
        eclipticTilt : 23.439281,

        //Web GL, Three JS components
        camera : new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000),
        projector : new THREE.Projector(),
        scene : new THREE.Scene(),
        renderer : new THREE.WebGLRenderer({antialias: true}), 
        viewPort : document.createElement("div"),

        //Navigation
        mousePosLock : [0, 0],
        mousePosCurrent : [0, 0],
        navigate : false,
        rotation : 0,
        cameraDistance : 300,

        sun : null, 
        sunMaterial : new THREE.MeshBasicMaterial({color:0xf7d06b, wireframe:false, transparent:true, overdraw:true}),
        sunCenter : new THREE.Mesh(new THREE.Geometry(), new THREE.Material()), 

        planets : [],

        initialize : function(){

            this.sun = new THREE.Mesh(new THREE.SphereGeometry(1), this.sunMaterial);
            this.sun.overdraw = true;
            this.sunCenter.add(this.sun);
            this.scene.add(this.sunCenter);

            var eclipticMaterial = new THREE.LineBasicMaterial({color:0xd1636e, transparent:true, opacity:0.5});
            
            //aligned with the X axis of the solar system, along the vernal equinox
            var xAxis = new THREE.Geometry();
            xAxis.vertices.push(new THREE.Vector3(2000, 0, 0));
            xAxis.vertices.push(new THREE.Vector3(-2000, 0, 0));
            var xAx = new THREE.Line(xAxis, eclipticMaterial);
            this.scene.add(xAx);

            var yAxis = new THREE.Geometry();
            yAxis.vertices.push(new THREE.Vector3(0, 0, 2000));
            yAxis.vertices.push(new THREE.Vector3(0, 0, -2000));
            var yAxis = new THREE.Line(yAxis, eclipticMaterial);
            this.scene.add(yAxis);

            //used for calibration
            if(this.debug){
                
                var axis = new THREE.AxisHelper(50);//red is X, green is Y, blue is Z
                axis.position.set(0, 0, 0);
                this.scene.add(axis);
                
                var unitCircleMap = THREE.ImageUtils.loadTexture("./img/unit_circle.png");
                unitCircleMap.wrapS = unitCircleMap.wrapT = THREE.RepeatWrapping;
                unitCircleMap.anisotropy = 16;

                var unitCircleMat = [
                    new THREE.MeshBasicMaterial({ambient:0xbbbbbb, transparent:true, opacity:0.6, map:unitCircleMap, side:THREE.DoubleSide})
                ]

                var unitCircle = THREE.SceneUtils.createMultiMaterialObject(new THREE.CircleGeometry(300, 32, 0, 2*Math.PI), unitCircleMat);
                unitCircle.rotation.x = -(Math.PI/2);
                this.scene.add(unitCircle);
            }

            //set up the planets, this information comes from http://nssdc.gsfc.nasa.gov/planetary/factsheet/
            var mercury = new Planet({name:"Mercury", color:0xcf9ace, eccentricity:0.20563069, majorAxis:0.38709893, inclination:7.00487, ascendingNode:48.33167, perihelion:0.307499, argOfPerihelion:77.45645, anchor:this.scene});
            var venus = new Planet({name:"Venus", color:0xfc9e61, eccentricity:0.00677323, majorAxis:0.72333199, inclination:3.39471, ascendingNode:76.68069, perihelion:0.718440, argOfPerihelion:131.53298, anchor:this.scene});
            var earth = new Planet({name:"Earth", color:0x426ac1, eccentricity:0.01671022, majorAxis:1.00000011, inclination:0.00005, ascendingNode:348.73936, perihelion:0.98329134, argOfPerihelion:102.94719, anchor:this.scene});
            var mars = new Planet({name:"Mars", color:0xd1636e, eccentricity:0.09341233, majorAxis:1.52366231, inclination:1.85061, ascendingNode:49.57854, perihelion:1.381497, argOfPerihelion:336.04084, anchor:this.scene});
            var jupiter = new Planet({name:"Jupiter", color:0xe88d34, eccentricity:0.04839266, majorAxis:5.20336301, inclination:1.30530, ascendingNode:100.55615, perihelion:4.950429, argOfPerihelion:14.75385, anchor:this.scene});
            var saturn = new Planet({name:"Saturn", color:0xffd2d7, eccentricity:0.05415060, majorAxis:9.53707032, inclination:2.48446, ascendingNode:113.71504, perihelion:9.04807635, argOfPerihelion:92.43194, anchor:this.scene});
            var uranus = new Planet({name:"Uranus", color:0x509deb, eccentricity:0.04716771, majorAxis:19.19126393, inclination:0.76986, ascendingNode:74.22988, perihelion:18.37551863, argOfPerihelion:170.96424, anchor:this.scene});
            
            this.planets.push(mercury);
            this.planets.push(venus);
            this.planets.push(earth);
            this.planets.push(mars);
            this.planets.push(jupiter);
            this.planets.push(saturn);
            this.planets.push(uranus);

            //set up the render/camera/view
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 1);

            //Mouse Navigation Events
            this.viewPort.onmousemove = function(e){
        
                System.mousePosCurrent[0] = e.pageX;
                System.mousePosCurrent[1] = e.pageY;
            }
            
            this.viewPort.onmousedown = function(e){
        
                System.mousePosLock[0] = e.pageX;
                System.mousePosLock[1] = e.pageY;
                System.navigate = true;
            }
            
            this.viewPort.onmouseup = function(e){
        
                System.navigate = false;
            }
        
            this.viewPort.appendChild(this.renderer.domElement);
            document.body.appendChild(this.viewPort);

            //3D Rendering Context
            this.projector = new THREE.Projector();
        
            this.camera.position.x = 0;
            this.camera.position.y = this.cameraDistance;
            this.camera.position.z = 0;
            this.scene.add(new THREE.AmbientLight(0xffffff));

            this.animate();
            this.getData();
        },

        render : function(){

            if(this.navigate){
        
                var yaw = this.mousePosCurrent[0] - this.mousePosLock[0];
                
                this.camera.position.x = Math.cos(yaw / 100) * this.cameraDistance;;
                this.camera.position.z = Math.sin(yaw / 100) * this.cameraDistance;;
                
                var pitch = this.mousePosLock[1] - this.mousePosCurrent[1];
                
                if(pitch > 0 && pitch < 360){
        
                    this.camera.position.y = Math.cos( pitch / 100 ) * this.cameraDistance;;
                }
            }
            
            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
        },

        onWindowResize : function(){
        
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },

        animate : function(){

            requestAnimationFrame(System.animate);
            System.render();
        },

        getData : function(){

            $.ajax({
                "url":"./data/ephemerides.json",
                "type":"GET",
                "dataType":"json",
                success:function(response){
        
                    //console.log(response);
                    System.drawPlanets(response);
                    //System.drawParticleOrbit(response);
                },
                error:function(xhr, ajaxOptions, thrownError){

                    //console.log(xhr, ajaxOptions, thrownError);
                    alert("Sorry there was a connection error.");                    
                }
            });
        },

        drawPlanets : function(ephemeris){

            var dt = new Date();
            var year = dt.getFullYear();
            var day = dt.getDate();
            var month = dt.getMonth() + 1;

            if(String(day).length == 1) day = "0" + day;
            dt = year + "-" + month + "-" + day;

            for(planet in this.planets){

                var name = this.planets[planet].get("name");

                if(ephemeris[name]){
                    
                    if(ephemeris[name][dt]){

                        var x = parseFloat(ephemeris[name][dt][0]) * System.scalar;
                        var y = parseFloat(ephemeris[name][dt][1]) * System.scalar;
                        var z = parseFloat(ephemeris[name][dt][2]) * System.scalar;

                        this.planets[planet].drawPlanet();
                        this.planets[planet].setPosition(x, z, -(y));
                    }
                }
            }
        },

        drawParticleOrbit : function(ephemeris){

            for(planet in this.planets){

                var name = this.planets[planet].get("name");
        
                var particles = new THREE.Geometry();
                var pMaterial = new THREE.ParticleBasicMaterial({
        
                    color: 0xFFFFFF,
                    size: 2
                });

                for(var date in ephemeris[name]){

                    var x = parseFloat(ephemeris[name][date][0]) * System.scalar;
                    var y = parseFloat(ephemeris[name][date][1]) * System.scalar;
                    var z = parseFloat(ephemeris[name][date][2]) * System.scalar;

                    particles.vertices.push(new THREE.Vector3(x, z, -(y)));
                }

                var particleSystem = new THREE.ParticleSystem(

                    particles,
                    pMaterial
                );            
                
                this.scene.add(particleSystem);
            }
        }
    }

    function degToRad(deg){

       return deg/180*Math.PI;
    }   
})(this);