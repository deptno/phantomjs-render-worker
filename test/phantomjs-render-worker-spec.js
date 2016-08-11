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
            const nextWork = targets.pop();
            nextWork && worker.render(nextWork, '/dev/null');
            check();
        })(worker);

        worker.on(init, success);
        worker.on(rendered, success);
    });
});

