var miss = require('mississippi');
var EventEmitter = require('events');

class Watcher extends EventEmitter {}

module.exports = function (/*tasks...*/) {
    var tasks = [];
    var current = 0;
    var watcher = new Watcher();

    for (var i = 0; i < arguments.length; i++) {
        tasks.push(arguments[i]);
    }

    watcher.on('next', (task) => {
        let stream = task();

        miss.finished(stream, (err) => {
            if (err) {
                watcher.emit('error', err);
                return
            }

            if (current < tasks.length) {
                watcher.emit('next', tasks[current++]);
                return;
            }

            watcher.emit('end');
        });
    });

    watcher.on('error', (err) => { watcher.emit('end'); });

    if (tasks.length > 0) {
        watcher.emit('next', tasks[current++]);
    }

    return watcher;
};