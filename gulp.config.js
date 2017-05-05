var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var reporter = require('./build/process/testing/jasmine/reporter');
var reporters = require('jasmine-reporters');

module.exports = function () {
    var tsFiles = '**/*.ts';
    var src = './src/';

    var tests = './spec/';
    var config = {
        /**
         * Sources Configuration
         */
        "project": 'tsconfig.json',

        "sources": {
            "files": {
                "all": [ src + tsFiles ]
            },
            "dir": src,
            "dest": src,
            "maps": "./"
        },


        /**
         * Unit Tests configuration
         */
        "tests": {
            "files": {
                "all": [ tests + "**/*.ts" ]
            },
            "specs": {
                "all": [ tests + "**/*.spec.js" ]
            },
            "jasmine": {
                "default": {
                    "reporter": new SpecReporter({
                        "spec": {
                            "displayPending": true
                        }
                    })
                },
                "watch": {
                    "reporter": new reporters.TerminalReporter({
                        "verbosity": 1
                    })
                },
                "custom": {
                    "reporter": reporter()
                }
            },
            "filter": [ "spec/**/*.*" ],
            "dir": tests,
            "dest": tests,
            "maps": "./"
        },

        "typings": "./typings/index.d.ts",

        "tslint": {
            formatter: "prose"
        }
    };

    return config;
};