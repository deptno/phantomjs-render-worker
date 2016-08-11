import phantom from 'phantom';
import {EventEmitter} from 'events';

export default class Worker extends EventEmitter {
    static event = {
        init: 'init',
        rendering: 'rendering',
        rendered: 'rendered',
        error: 'error'
    };
    config = {
        viewportSize: {
            width: 1024,
            height: 1024 * (2339 / 1654)
        },
        paperSize: {
            format: 'A4',
            orientation: 'portrait',
            width: 825+'px',
            height: 1166+'px',
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        }
    };
    page;
    delay;
    poll;

    constructor(format, delay, poll, config) {
        super();

        this.format = format || 'png';
        this.delay = (delay || 1) * 1000;
        this.poll = poll || (() => true);
        this.init(config || this.config);
    }

    async init(config) {
        const instance = await phantom.create();
        const page = await instance.createPage();

        Object.keys(config).map(prop => page.property(prop, config[prop]));

        this.page = page;
        this.emit(Worker.event.init, this);
    }

    async render(url, file, poll) {
        const status = await this.page.open(url);

        if (status === 'success') {
            this.emit(Worker.event.rendering, this);
            this._render(file, poll || this.poll);
        } else {
            this.emit(Worker.event.error, this);
        }
    }

    _render(file, poll) {
        setTimeout(async () => {
            const ready = await this.page.evaluate(poll);
            if (ready) {
                await this.page.render(file, {format: this.format});
                this.emit(Worker.event.rendered, file);
            } else {
                this._render(file, poll);
            }
        }, this.delay);
    }
}
