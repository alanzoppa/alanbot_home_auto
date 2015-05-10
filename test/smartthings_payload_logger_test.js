var fake_smartthings_payloads = require('./fake_smartthings_payloads.json');
var SmartthingsPayloadLogger = require('../smartthings_payload_logger');
var test_data = require('../test_data.json')
var tk = require('timekeeper');
var fs = require('fs');
require('chai').should();


describe("smartthings logging", function() {
    beforeEach(function() {
        var time = new Date(2015, 3, 1);
        tk.freeze(time);
        this.logger = new SmartthingsPayloadLogger();
    })
    afterEach(function() {
        tk.reset();
    })

    it("should create a header string", function() {
        this.logger._generateHeader().should.eql(test_data.smartthings_logging.test_csv_header)
    })

    it("should create the right filename", function() {
        this.logger._generateFilename().should.eql(
                'smartthings-requests-04-2015-test.csv'
                )
    })

    it("should generate lines of data from a smartthings payload", function() {
        this.logger._createCSVString(fake_smartthings_payloads[0]).should.eql(
            test_data.smartthings_logging.test_csv_row
        )
    })

    it("should find the log path", function() {
        var expected = __dirname.replace(/test$/, 'logs');
        expected.should.eql(this.logger.logPath);
    })

    it("should find the log filename", function() {
        var expected = __dirname.replace(/test$/, 'logs');
        var expected = expected + '/' + this.logger._generateFilename();
        expected.should.eql(this.logger.logFilename);
    })

    describe("file behavior", function() {
        beforeEach(function() {
            fs.unlinkSync(this.logger.logFilename);
            this.logger._ensureLogfileWithHeader();
        })
        afterEach(function() {
            fs.unlinkSync(this.logger.logFilename);
        })
        it("should create a log file", function(done) {

            // This will raise an error if the file doesn't exist
            fs.readFile(this.logger.logFilename, (err, data)=> {
                data.toString().should.eql(test_data.smartthings_logging.test_csv_header)
                done();
            })
        })

        it("should log new lines", function(done) {
            this.logger.log(fake_smartthings_payloads[0], ()=>
                fs.readFile(this.logger.logFilename, (err, data)=> {
                    data.toString().should.eql(
                        test_data.smartthings_logging.test_csv_header +
                        test_data.smartthings_logging.test_csv_row
                    )
                    done();
                })
            )

        })
    })


})

