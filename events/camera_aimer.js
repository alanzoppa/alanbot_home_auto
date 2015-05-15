var http = require('http');
var querystring = require('querystring');
var R = require('ramda');
var Q = require('q');
var parseString = require('xml2js').parseString;


class CameraAimer {
    constructor(config) {
      this.config = config;
      this.state = null;
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
        var aimer = this;
        this.pathsForState(state).map(function(path) {
            var deferral = Q.defer();
            promises.push(deferral.promise);
            http.get(path, function(res) {
                res.on('data', function(chunk) {
                    var body = chunk.toString('utf-8');
                    parseString(body, function(err, r) {
                        if (r && r['CGI_Result'] && r['CGI_Result'].runResult
                            && r['CGI_Result'].runResult[0] == '0'
                            ) {
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
        var allPromises = Q.all(promises);
        allPromises.then( ()=> {this.state = state;})
        return allPromises;
    }
}

module.exports = CameraAimer
