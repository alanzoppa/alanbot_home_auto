var fs = require('fs');
var machina = require('machina');

var fsm = machina.Fsm.extend( {

    stateFileName: __dirname+'/tmp/lastState',

    initialize: function( options ) {
        try {
            var lastState = fs.readFileSync(this.stateFileName).toString();
            this.transition(lastState);
        } catch (e) {
            this.transition('home');
        }
    },

    namespace: "home-fsm",
    initialState: "uninitialized",

    stEvent: function(payload) {
        this.transition(payload.value.toLowerCase());
    },

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
