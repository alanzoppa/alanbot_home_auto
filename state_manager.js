var fs = require('fs');
var machina = require('machina');
var config = require('./config.json').camera;
var CameraAimer = require('./events/camera_aimer');

var events = require('events');
var eventMachine = new events.EventEmitter();

var fsm = machina.Fsm.extend( {

    stateFileName: __dirname+'/tmp/lastState',

    initialize: function( options ) {
        this.cameraAimer = new CameraAimer(eventMachine, config);
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
        //console.log(payload);
        //console.log(payload.value);
        this.transition(payload.value.toLowerCase());
    },

    states: {
        uninitialized: {
        },
        home: {
            _onEnter: function() {
                fs.writeFileSync(this.stateFileName, 'home')
                this.cameraAimer.setState('lookAway');
            }
        },
        away: {
            _onEnter: function() {
                fs.writeFileSync(this.stateFileName, 'away');
                this.cameraAimer.setState('watch');
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
