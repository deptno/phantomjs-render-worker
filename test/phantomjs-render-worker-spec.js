import "babel-polyfill";
import Worker from '../src';

describe('phantomjs-render-worker', () => {
    it('create worker with default config', done => {
        const targets = ['http://google.com', 'http://facebook.com'];
        const worker = new Worker('pdf');
        const {init, rendered, rendering, error } = Worker.event;
        const eventCount = 3;
        const check = (id => () => eventCount === ++id && done())(0);
        const success = (worker => file => {
            const nextWork = targets.shift();
            nextWork && worker.render(nextWork, '/dev/null', (() => true));
            check();
        })(worker);

        worker.on(init, success);
        worker.on(rendered, success);
    });
    it('create worker with default config work via promise', done => {
        const targets = ['http://google.com', 'http://facebook.com'];
        const worker = new Worker('pdf');
        const {init, rendered, rendering, error } = Worker.event;
        const eventCount = 3;
        const check = (id => () => eventCount === ++id && done())(0);

        worker.on(init, () => {
            check();
            (function loopback() {
                const nextWork = targets.shift();
                if (nextWork) {
                    worker.render(nextWork, '/dev/null', (() => true)).then(loopback);
                }
            })();
        });
        worker.on(rendered, check);
    });
});
