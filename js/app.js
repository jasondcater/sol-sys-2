(function(global){

    "use strict";

    /**
     * A simple script to set up and provide data to SolSys
     */

    global.App = {

        initialize : function(){
 
            this.solSys = new SolSys();

            /**
             * To see one orbit or the other you can just comment out
             * the orbit you don't want to see.
             */
            this.loadKeplerianElements();
            this.loadCartesianElements();
        },

        /**
         * Get the Kepler Orbital Elements for the planents.
         * As long as you follow the object structure you can
         * start up any orbits like so...
         */
        loadKeplerianElements : function(){

            /**
             * "planetKeplerElements" is a global variable set in the file of 
             * the same name.
             */
            this.solSys.drawVectorOrbits(planetKeplerElements);
        },

        /**
         * I've acquired a bunch of Ephemeris data from NASA to help
         * show you how this model works, however the dates for the
         * data may not be current. DO NOT rely on the input data
         * here for your models. Generate your own data:
         *
         *      http://ssd.jpl.nasa.gov/horizons.cgi
         *
         * See the README.md for more information
         */
        loadCartesianElements : function(){

            /**
             * "planetCartesianElements" is a global variable set in the file of 
             * the same name.
             */
            this.solSys.drawPointOrbits(planetCartesianElements)
        }
    };
})(this);