var fs = require('fs');
var machina = require('machina');
var path = require('path');
var config = require('../config.json')
var CameraAimer = require('../lib/camera_aimer');
var R = require('ramda');
var HueSettings = require('./hue_settings');

var fsm = machina.Fsm.extend( {

    stateFileName: path.join(__dirname, '..', 'tmp/lastState'),

    initialize: function( options ) {
        this.cameraAimer = new CameraAimer(config.camera);
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
        var stValue = payload.value.toLowerCase();
        if ( R.contains(stValue)(this._allowedStates()) ) {
            this.transition(stValue);
        }
        else {
            this.handle(stValue);
        }
    },

    _allowedStates: function() {
        var states = Object.keys(this.states);
        return R.filter( function(it) { return it != 'uninitialized'; }, states)
    },

    states: {
        uninitialized: { },
        home: {
            _onEnter: function() {
                fs.writeFile(this.stateFileName, 'home')
                this.cameraAimer.setState('lookAway');
            },
            present: function() {
                var cameHomeRobotMaker = require('./came_home_blink');
                var hueSettings = new HueSettings(config);
                hueSettings.setup.then(function(){
                    var blinkInterval = (process.env.ENV == 'test') ? 10 : null;
                    cameHomeRobotMaker(hueSettings, blinkInterval).start();
                })

            }
        },
        away: {
            _onEnter: function() {
                fs.writeFile(this.stateFileName, 'away');
                this.cameraAimer.setState('watch');
            }
        },
        evening: {
            _onEnter: function() {
                fs.writeFile(this.stateFileName, 'evening');
            }
        },
        night: {
            _onEnter: function() {
                fs.writeFile(this.stateFileName, 'night')
            }
        }
    }
} );

module.exports = fsm;
