# 3D/Web GL Solar System Model

This is a 3D model of the Solar System that renders in the browser. This makes it easy to implement in other projects, such as games or front ends for scientific models. This system can render either Keparian Orbital Elements or Cartesian State Vectors (<X,Y,Z> points). I've included default data sets of the planets in both formats so you can get a sense of what to expect in usage.

## Adjustments made for computer graphics

One of the issues that can arise in modeling the Solar system is the conversion from the Ecliptic Coordinate System (ECS) to the computer's graphical coordinate system (CGCC). (Read below for more on the ECS)

In the CGCC the Y and Z axes are in the wrong places and directions as compared to the ECS. You will need to convert between the coordinate systems for you to get an accurate result. However, you don't need to do any linear algebra to accomplish the proper rotations. There is an easy to implement solution. By rotating _around_ the X-Axis the CGCC will match the ECS. Here is how you do that.

Before you add an item to the `scene` create a parent graphical object and rotate it by -90˚. Then attach your desired elements to this parent element. Now you should be able to treat ECS coordinates as they should be with no further transtlations needed. 

Example (you will see me do this in the code) :
```javascript

//the child object
var particleSystem = new THREE.Points(particles, particleMaterial); 

//the parent object
var center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffff00}));

//the rotation around the X-Axis
center.rotation.x = -(90/180*Math.PI);

//add the child to the parent
center.add(particleSystem);

//add the parent to the scene
this.scene.add(center);

```
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/graphics_rotation.jpg)

There is a "debug" flag in the `SolSys` file. By setting it to `true` you will activate an axis helper and unit circle which will help with orientation in the ECS reference frame. Red = X-Axis, Green = Y-Axis, Blue = Z-Axis

## Definitions of Keparian Orbital Elements

Each orbit in solar system can be described as an ellipse in 3D. This ellipse has a few elements that describe its shape and orientation around a point (in our case it's mostly the Sun, but it doesn't have to be). The elements are described below. When first trying to understand these elements it can be confusing because there are interchangeable names and symbols. I will try and describe when a name or symbol indicates the same value.

##### Semi Major Axis
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/little_a.jpg)
symbol, "a" or greek letter Little Alpha 
  * The semi-major axis is one half of the major axis, and thus runs from the center, through a focus, and to the perimeter. Essentially, it is the radius of an orbit at the orbit's two most distant points. For the special case of a circle, the semi-major axis is the radius.

##### Eccentricity
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/little_e.jpg)
symbol, "e" or little e
  * The orbital eccentricity of an astronomical object is a parameter that determines the amount by which its orbit around another body deviates from a perfect circle. i.e. how squished the ellipse is.

##### Inclination
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/little_i.jpg)
symbol, "i" or little i
 * Orbital inclination is the angle between a reference plane and the orbital plane or axis of direction of an object in orbit around another object. Or how much tilt the orbit has relative to the Solar System reference plane (more about the Solar System Plane in J200 Ecliptic Reference frame below). But the reference plane we are talking about is the flat-ish part of the solar system.

##### Longitude of Ascending Node
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/big_omega.jpg)
symbol, "Ω" or greek letter Big Omega
 * If you have an orbit that is inclined (which all natural orbits are to some degree, even if it's very small) then there is a point in which the orbit passes upward (acending) through the reference plane (mentioned earlier and described in more detail later) and downward on its return. If you have an imaginary line drawn on the reference plane you can meausure the angle from where the orbit crosses up (acends) through the reference plane.

 * Also see "Ascending Node" in the extra definitions below.

##### Argument of Perihelion (can be known as periapsis)
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/little_omega.jpg)
symbol, "w" or greek letter Little Omega
  * Once you know where in the reference plane the orbit is "acending" you have a good reference point. From there you can find out at which angle the the distance from the center body (in this case the Sun) is the shortest.

  * Also see "Longitude of Perihelion" in the extra definitions below.

![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/orbital_elements.jpg)

## Definitions of Ecliptic Coordinate System (Heliocentric Ecliptic Coordinates, Fundemental Plane)
https://en.wikipedia.org/wiki/Ecliptic_coordinate_system

Once you understand the parts of the orbit you need some way to orient them in a space. You need a reference frame. A starting point from which you can say "This way is up, and that way is down". In more precise terms we use the Ecliptic Coordinate System. 

On a special day of the year (Spring Equinox) the Earth and Sun are in a particular orientation to each other. 
From this point in time (12 noon in GMT on Spring Equinox to be exact) we draw a line from the Earth to the Sun.
This imaginary line becomes our X-Axis. The positive direction of the X-Axis starts at the Sun and continues on AWAY from the Earth along this imaginary line. This means that on Spring Equinox the Earth is at -1 AU (Astronomical Units) by our coordinate system. 

Now pretend that we are looking down on the Solar System towards the North Pole of the Earth on Spring Equinox. 
And imagine that as we are looking down on the Solar System the X-Axis extends in the left and right direction with positive X going from the Sun to the right direction.

Our Y-Axis would be perpendicular to the X-Axis. And our Y-Axis would be extending up and down (up and down from our eleveated view, we are looking down remember). The positive Y-Axis would be in the up direction and negative Y-Axis would be downward.

This XY Plane would be roughly the same plane that most of the planets look like they are in.

The Z-Axis is perpendicular to both the X-Axis and Y-Axis.

From the wiki - "Heliocentric ecliptic coordinates. The origin is the center of the Sun. The fundamental plane is the plane of the ecliptic. The primary direction (the x axis) is the vernal equinox. A right-handed convention specifies a y axis 90° to the east in the fundamental plane; the z axis points toward the north ecliptic pole. The reference frame is relatively stationary, aligned with the vernal equinox."

![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/heliocentric_ecliptic.jpg)

## Other important orbital elements

##### Barycenter
  * In space nothing is fixed. In a situation when two or more items/objects/bodies are orbiting they orbit each other around a point which is somewhere between the centers of each item. It is not true that the planets orbit around the Sun. The sun and planets orbit around a graviational center. Since the Sun is so much more massive than the planets this graviational center is also located inside the Sun (but not at the Sun's center). A gravitational center is known as A barycenter and is not at the center of an object, but is used as a reference point between two objects.

##### Periapsis
  * The point in the path of an orbiting body at which it is nearest to the body that it orbits. i.e. The closest approch that one orbiting body makes toward another. So this means that Perihelion (closest approch to the Sun) is just a special case of Periapsis.

#### Longitude of Perihelion
  * The sum of two angles: "Longitude of Ascending Node" + "Argument of Perihelion" = "Longitude of Perihelion"
  * You may encounter the "Longitude of Perihelion" out in the wild, and you may need "Argument of Perihelion" instead. IF you have "Longitude of Ascending Node" and "Longitude of Perihelion", just subtract one from the other.

#### Ascending Node
![alt tag] (https://raw.githubusercontent.com/jasondcater/sol-sys-2/master/img/letters/ascending_node.jpg)
  * The point in space where the three planes ("funamental/ecliptic", "inclination", and "longitude of ascending node) intersect in space.

#### Semi Minor Axis
  * From the wiki: In geometry, the semi-minor axis (also semiminor axis) is a line segment associated with most conic sections (that is, with ellipses and hyperbolas) that is at right angles with the semi-major axis and has one end at the center of the conic section.
  * i.e. Half of the distance in the short area of an ellipse.
