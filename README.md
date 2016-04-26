# 3D/Web GL Solar System Model

This is a 3D model of the Solar System that renders in the browser which makes it easy to implement in other projects, such as games or front ends for scientific models. This system can render either Keparian Orbital Elements or Cartesian State Vectors (<X,Y,Z> points). I've included default data sets of the planets in both formats so you can get a sence of what to expect in usage.

## Definitions of Keparian Orbital Elements

Each orbit in solar system can be described as an ellipse in 3D. This ellipse has a few elements that describe its shape and orientation around a point (in our case it's mostly the Sun, but it doesn't have to be). The elements are described below. When first trying to understand these elements it can be confusing because there are interchangeable names and symbols. I will try and describe when a name or symbol indicates the same value.

#### Semi Major Axis
symbol, "a" or greek letter Little Alpha
  * The semi-major axis is one half of the major axis, and thus runs from the center, through a focus, and to the perimeter. Essentially, it is the radius of an orbit at the orbit's two most distant points. For the special case of a circle, the semi-major axis is the radius.

#### Eccentricity
symbol, "e" or little e
  * The orbital eccentricity of an astronomical object is a parameter that determines the amount by which its orbit around another body deviates from a perfect circle. i.e. how squished the ellipse is.

#### Inclination
symbol, "i" or little i
 * Orbital inclination is the angle between a reference plane and the orbital plane or axis of direction of an object in orbit around another object. Or how much tilt the orbit has relative to the Solar System reference plane (more about the Solar System Plane in J200 Ecliptic Reference frame below). But the reference plane we are talking about is the flat-ish part of the solar system.

#### Longitude of Ascending Node
symbol, "Ω" or greek letter Big Omega
 * If you have an orbit that is inclined (which all natural orbits are to some degree, even if it's very small) then there is a point in which the orbit passes upward (acending) through the reference plane (mentioned earlier and described in more detail later) and downward on its return. If you have an imaginary line drawn on the reference plane you can meausure the angle from where the orbit crosses up (acends) through the reference plane.

#### Argument of Perihelion
symbol, "w" or greek letter Little Omega
  * Once you know where in the reference plane the orbit is "acending" you have a good reference point. From there you can find out at which angle the the distance from the center body (in this case the Sun) is the shortest.

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

## Other important orbital elements

Barycenter - In space nothing is fixed. In a situation when two or more items/objects/bodies are orbiting they orbit each other around a point which is somewhere between the centers of each item. It is not true that the planets orbit around the Sun. The sun and planets orbit around a graviational center. Since the Sun is so much more massive than the planets this graviational center is also located inside the Sun (but not at the Sun's center). A gravitational center is known as A barycenter and is not at the center of an object, but is used as a reference point between two objects.