var util = require('gulp-util');

let siteExpression = /\(([\w\:\\\.]+)\:(\d+)\:(\d+)\)/i;

let getSite = (trace) => {
    let source = trace.filter(spot => {
        if (spot.indexOf && spot.indexOf('jasmine.js') < 0) {
            return true;
        }
        return false;
    });

    if (source.length && source.length > 1) {
        let match = source[1].match(siteExpression);

        return [
            match[1],
            match[2],
            match[3]
        ].join(':');
    }

    return 'unknown.js:1:1';
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
    }

    jasmineDone(jasmineResult) {
        this.finished = new Date();
        // .order { random, seed, sort }
        // .failedexpectations []
        reportErrorList(jasmineResult.failedExpectations);
    }

    suiteStarted(suiteInfo) {
        // .id
        // .description
        // .fullName
        // .failedExpectations []
        reportErrorList(suiteInfo.failedExpectations);
    }

    suiteDone(suiteResult) {
        // .id
        // .description
        // .fullName
        // .failedExpectations []
        // .status
        reportErrorList(suiteResult.failedExpectations);
    }

    specStarted(specInfo) {
        // .id
        // .description
        // .fullName
        // .failedExpectations [] { matcherName, message, stack, passed, expected, actual }
        // .passedExpectations [] { matcherName, message, stack, passed }
        // .pendingReason
        reportErrorList(specInfo.failedExpectations);
    }

    specDone(specResult) {
        // .id
        // .description
        // .fullName
        // .failedExpectations [] {.message .stack}
        // .passedExpectations [] { matcherName, message, stack, passed }
        // .pendingReason
        // .status
        reportErrorList(specResult.failedExpectations);
    }
}

module.exports = function() {
    return new Reporter();
};