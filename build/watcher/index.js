var EventEmitter = require('events');

class Watcher extends EventEmitter {}

class Task extends EventEmitter {
    constructor(task) {
        super();

        this.task = task;
        this.isDone = false;
    }

    run() {
        let that = this;

        let done = (err) => {
            if (that.isDone) {
                return;
            }

            that.isDone = true;
            that.emit('end', err);
        };


        var stream = this.task();

        [
            'end',
            'finish',
            'error',
            'close'
        ].forEach((e) => { stream.on(e, done); });
    }
}

module.exports = function (/*tasks...*/) {
    if (arguments.length === 0) {
        throw Error("Should have at least one task to run.");
    }

    var tasks = [];
    var current = 0;
    var watcher = new Watcher();

    let next = (err) => {
        if (err) {
            watcher.emit('error', err);
            return
        }

        if (current < tasks.length) {
            watcher.emit('next', tasks[current++]);
            return;
        }

        watcher.emit('end');
    };

    for (var i = 0; i < arguments.length; i++) {
        let t = new Task(arguments[i]);
        t.on('end', next);
        tasks.push(t);
    }

    watcher.on('next', (task) => { task.run(); });
    watcher.on('error', (err) => { watcher.emit('end', err); });

    watcher.emit('next', tasks[current++]);

    return watcher;
};