(function(global){

    "use strict";

    /**
     * A simple script to set up and provide data toSolSys
     */

    global.App = {

        initialize : function(){
 
            this.solSys = new SolSys();
        },

        /**
         * Get the Kepler Orbital Elements for the planents.
         * As long as you follow the object structure you can
         * start up any orbits like so...
         */
        loadKeplerianElements : function(){

            //console.log("sup");
        },
    };
})(this);