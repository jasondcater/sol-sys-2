(function(global){

    "use strict";

    /**
     * A simple script to set up and provide data toSolSys
     */

    global.App = {

        initialize : function(){
 
            this.solSys = new SolSys();

            this.loadKeplerianElements();
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
    };
})(this);