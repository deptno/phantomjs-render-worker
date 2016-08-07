import "babel-polyfill";
import Worker from '../src';

describe('phantomjs-render-worker', () => {
    it('create worker with default config', done => {
        const getId = (id => () => id++)(0);
        const targets = ['http://google.com', 'http://facebook.com'];
        const eventCount = 5;
        const check = (id => () => eventCount === ++id && done())(0);

        const success = worker => {
            const nextWork = targets.shift();
            nextWork && worker.render(nextWork);
            check();
        };

        const worker = new Worker(() => `/dev/null`, { format: 'pdf' });

        worker.on('rendered', check);
        worker.on('success', success);
        worker.on('ready', success);
    });
});

