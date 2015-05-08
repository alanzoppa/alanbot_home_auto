var base_config = require('../config.json').camera;
var http = require('http');
var querystring = require('querystring');
var R = require('ramda');
var Q = require('q');
var parseString = require('xml2js').parseString;


class CameraAimer {
    constructor(config) {
      this.config = config || base_config;
    }
    _paramsFor(state) {
        var state = this.config.states[state];
        var out = {};
        for (let port of Object.keys(state)) {
            out[port] = R.merge(this.config.params, state[port]);
        }
        return out;
    }

    _urlWithPath(port) {
        return `${this.config.base}:${port}${this.config.path}`
    }

    pathsForState(state) {
        var paramArrays = this._paramsFor(state);
        var out = [];
        for (let port of Object.keys(paramArrays)) {
            var base = this._urlWithPath(port);
            var params = querystring.stringify(paramArrays[port]);
            out.push(`${base}?${params}`);
        }
        return out;
    }

    setState(state, callback) {
        var promises = [];
        this.pathsForState(state).map(function(path) {
            var deferral = Q.defer();
            promises.push(deferral.promise);
            http.get(path, function(res) {
                res.on('data', function(chunk) {
                    parseString(chunk.toString('utf-8'), function(err, result) {
                        if (result['CGI_Result'].result[0] == '0') {
                            deferral.resolve(true);
                        }
                        else { deferral.reject("The command failed") }
                    })
                });
                res.on('error', function(e) {
                    deferral.reject(e.message);
                });
            })
        })
        return Q.all(promises)
    }
}

module.exports = CameraAimer
