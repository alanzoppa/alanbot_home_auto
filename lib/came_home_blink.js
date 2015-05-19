var Cylon = require('cylon'); 

function ringaroundLights(my, delayBetweenLights, callback) {
    my['Kitchen 1'].toggle();
    setTimeout( my['Kitchen 2'].toggle, delayBetweenLights )
        setTimeout( my['Kitchen 3'].toggle, delayBetweenLights*2 )
        setTimeout( my['Kitchen 1'].toggle, delayBetweenLights*3 )
        setTimeout( my['Kitchen 2'].toggle, delayBetweenLights*4 )
        setTimeout( my['Kitchen 3'].toggle, delayBetweenLights*5 ) 
        if (callback) { setTimeout( callback, delayBetweenLights*6 ) } 
}; 

module.exports = function(hueSettings, blinkInterval) {
    if (!blinkInterval) { blinkInterval = 250; }

    return Cylon.robot({
        connections: { hue: hueSettings.cylonConfig() },

        devices: hueSettings.cylonLights,

        work: function(my) { 
            ringaroundLights(my, blinkInterval, function() {
                ringaroundLights(my, blinkInterval);
            }); 
        }
    })
}
