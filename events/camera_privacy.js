var config = require('../config.json');
var http = require('http');
var querystring = require('querystring');
var R = require('ramda');

module.exports = class CameraAimer {
    constructor(config) {
      this.config = config;
    }
    _paramsFor(state) {
       var state = this.config.states[state];
       var out = [];
       for (let port of Object.keys(state)) {
           out.push(R.merge(this.config.params, state[port]));
       }
       return out;
       //}
    }
}


//var url = `${this.config.base}/${this.config.path}`;

           
           
//class Model {
  //constructor(properties) {
      //this.properties = properties;
    //}

  //toObject() {
      //return this.properties;
    //}
//}

//var jack = new Model({
  //name: 'jack'
//});
