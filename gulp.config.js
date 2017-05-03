var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

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
                "reporter": new SpecReporter({
                    "spec": {
                        "displayPending": true
                    }
                })
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