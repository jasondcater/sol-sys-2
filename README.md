sol-sys
=======

A small 3D model of the Solar System to be used as the basis of other projects. needs Three.js

This Solar System Model has two components.

The first component is the rendering of the orbits as ellipses.
We use the orbital elements from http://nssdc.gsfc.nasa.gov/planetary/factsheet/ and generate the nice colored oribts.

The second component uses ephmerides from http://ssd.jpl.nasa.gov/horizons.cgi We use the Solar System Barycenter (SSB) [500@0] and generate the xyz vector coordinates for each planet.

The raw ephemeride data pulled from NASA is in ./data/NASA_Horizon_Ephemeride_2013-2017.zip

The ephemeride data is used to place the individual planets.

If you uncomment the funciton "System.drawParticleOrbit(response);" in the ajax response to the request for "./data/ephemerides.json" you will see a clouds of particles that corrispond to the planent positions for each day. This should trace the path that is generated in first component, and can be used for calibration.

Default behavior should have the orbits drawn by the first compoent and the planets placed in the orbit by the second component.

Most of the wieght in this project is due to the ephemeride data. If you dump that data this application should be fairly light.