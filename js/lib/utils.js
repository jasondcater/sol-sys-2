(function(global){

    "use strict";

    /*
     * General Utility Functions that are handy anywhere!
     */

    global.Utils = {

        /**
         *  Barebones XHR/AJAX wrapper
         */
        ajax : function(url, arg, callback){

            var echo = false;
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(){
    
                switch(xhr.readyState){
    
                    case 0:
    
                        //blah
                        break;
                    case 1:
    
                        if(echo) console.log("connection opened : "+ url);
                        break;
                    case 2:
    
                        var length = xhr.getResponseHeader("Content-Length");
                        var type = xhr.getResponseHeader("Content-Type");
                        var date = xhr.getResponseHeader("Date");
                        var lastMod = xhr.getResponseHeader("Last-Modified");
                        var server = xhr.getResponseHeader("Server");
    
                        if(echo){

                            console.log(" headers received : "+ url);
                            console.log("  response status : "+ xhr.status);
                            //console.log("           length : "+ length);
                            console.log("    response type : "+ type);
                        }
                        break;
                    case 3:
    
                        if(echo) console.log("          loading : "+ url);
                        break;
                    case 4:
    
                        if(echo) console.log("         finished : "+ url);
                        
                        if(xhr.status === 200){

                            var type = xhr.getResponseHeader("Content-Type");
                            if(type === "application/json"){

                                callback(JSON.parse(xhr.responseText));
                            }
                            else{

                                callback(xhr.responseText);
                            }
                        }
                        else{

                            console.log(xhr);
                            var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=200, top="+(screen.height-400)+", left="+(screen.width-840));
                            win.document.body.innerHTML = xhr.responseText;
                        }
                        break;
                    default:
                        break;
                }
            };
            
            if(echo) console.log("--------------- AJAX ---------------");
            xhr.open("POST", encodeURI(url));
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(encodeURI(arg));
        }    
    };
})(this);