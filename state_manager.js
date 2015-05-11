var fs = require('fs');
var machina = require('machina');

var fsm = machina.Fsm.extend( {

    stateFileName: __dirname+'/tmp/lastState',

    initialize: function( options ) {
        try {
            var lastState = fs.readFileSync(this.stateFileName).toString();
            //console.log('resuming: '+lastState);
            this.transition(lastState);
        } catch (e) {
            this.transition('home');
        }
    },

    namespace: "home-fsm",
    initialState: "uninitialized",

    states: {
        uninitialized: {
        },
        home: {
            _onEnter: function() {
                fs.writeFileSync(this.stateFileName, 'home')
            }
        },
        away: {
            _onEnter: function() {
                fs.writeFileSync(this.stateFileName, 'away')
            }
        },
        night: {
            _onEnter: function() {
                fs.writeFileSync(this.stateFileName, 'night')
            }
        }
    }
} );

module.exports = fsm;
