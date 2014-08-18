
(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        
        module.exports = factory( global );
            
    } else {

        factory( global );

    }

// Pass this if window is not defined yet
} ( window, function( window ) {

    "use strict";

    var worker;
    var stamps = { };

    if( ! worker ) {
        var url = require.toUrl('../src/jcampconverter_worker.js');
        worker = new Worker( url );
        worker.addEventListener('message', function( event ) {
            var stamp = event.data.stamp;
            if( stamps[ stamp ] ) {
                stamps[ stamp ].resolve( event.data.output );
            }
        });
    }
    
    var JcampConverter = function( input ) {

        var stamp = Date.now( ) + Math.random( );
        worker.postMessage( { stamp: stamp, input: input } );
        stamps[ stamp ] = $.Deferred( );
        return stamps[ stamp ];
    }


    if( typeof define === "function" && define.amd ) {
        
        define( function( ) {
            return JcampConverter;
        });

    } else if( window ) {
        
        window.JcampConverter = JcampConverter;
    }

}));