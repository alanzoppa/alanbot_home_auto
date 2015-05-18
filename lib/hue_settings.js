var request = require('request');
var R = require('ramda');
var Q = require('q');

class HueSettings {
    constructor(config) {
        this.hue_config_url = `http://${config.hue.cylon.host}/api/${config.hue.cylon.username}`;
        this.baseConfig = config;
        this.config_deferral = Q.defer();
        this.setup = this.config_deferral.promise;
        request(this.hue_config_url, (err, res, body)=> {
            if (err) { this.config_deferral.reject(err) }
            var cfg = JSON.parse(body);
            this._setupLights(cfg);
        })
    }
    _setupLights(config) {
        let keys = Object.keys(config.lights);
        this.cylonLights = {};
        for (let key of keys) {
            let light = config.lights[key];
            this.cylonLights[`${light.name}`] = {driver: 'hue-light', lightId: parseInt(key)}
        }
        this.config_deferral.resolve(this);
    }
    cylonConfig() {
        return this.baseConfig.hue.cylon;
    }
}

module.exports = HueSettings;


//http://192.168.1.11/api/1d37bee36377f4f314ee3db391646c7
