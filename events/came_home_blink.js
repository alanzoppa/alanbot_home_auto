var Cylon = require('cylon');

module.exports = function(hueSettings) {
    //console.log(hueSettings.cylonLights);
    return Cylon.robot({
      connections: {
            hue: hueSettings.cylonConfig()
      },

      devices: hueSettings.cylonLights,

      work: function(my) {
          my['Kitchen 1'].toggle();
          my['Kitchen 2'].toggle();
          my['Kitchen 3'].toggle();
          my['Kitchen 1'].toggle();
          my['Kitchen 2'].toggle();
          my['Kitchen 3'].toggle();
      }
    })
}
