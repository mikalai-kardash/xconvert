var util = require('gulp-util');

let getSite = (trace) => {
    let source = trace.filter(spot => {
        if (spot.indexOf && spot.indexOf('jasmine.js') < 0) {
            return true;
        }
        return false;
    });

    if (source.length && source.length > 1) {
        return source[1];
    }

    return 'unknown:0:0';
};

let reportError = (fail) => {
    let result = fail.passed;
    let message = fail.message;
    let stack = fail.stack;
    let trace = stack.split('\n');
    let site = getSite(trace);

    util.log("ERROR: " + site + ': ' + message);
};

let reportErrorList = (fails) => {
    if (fails.length) {
        fails.forEach((fail) => reportError(fail));
    }
};

class Reporter {
    jasmineStarted(jasmineInfo) {
        this.started = new Date();

        // .totalSpecsDefined
        //util.log('jasmine started')
        util.log(jasmineInfo);
    }

    jasmineDone(jasmineResult) {
        this.finished = new Date();

        // .order { random, seed, sort }
        // .failedexpectations []
        //util.log('jasmine done')
        reportErrorList(jasmineResult.failedExpectations);
    }

    suiteStarted(suiteInfo) {
        // .id
        // .description
        // .fullName
        // .failedExpectations []
        //util.log('suite started')
        reportErrorList(suiteInfo.failedExpectations);
    }

    suiteDone(suiteResult) {
        // .id
        // .description
        // .fullName
        // .failedExpectations []
        // .status
        //util.log('suite done')
        reportErrorList(suiteResult.failedExpectations);
    }

    specStarted(specInfo) {
        // .id
        // .description
        // .fullName
        // .failedExpectations [] { matcherName, message, stack, passed, expected, actual }
        // .passedExpectations [] { matcherName, message, stack, passed }
        // .pendingReason
        //util.log('spec started')
        reportErrorList(specInfo.failedExpectations);
        //util.log(specInfo.passedExpectations);
    }

    specDone(specResult) {
        // .id
        // .description
        // .fullName
        // .failedExpectations [] {.message .stack}
        // .passedExpectations [] { matcherName, message, stack, passed }
        // .pendingReason
        // .status
        //util.log('spec done')
        reportErrorList(specResult.failedExpectations);
        //util.log(specResult.passedExpectations);
    }
}

module.exports = function() {
    return new Reporter();
};