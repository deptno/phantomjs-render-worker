import phantom from 'phantom';
import {EventEmitter} from 'events';

export default class Worker extends EventEmitter {
    static event = {
        success: 'success',
        rendered: 'rendered',
        error: 'error'
    };
    page;
    fnGetRenderParam;

    constructor(fnGetRenderParam, config) {
        super();

        this.fnGetRenderParam = fnGetRenderParam;
        this.init(config);
    }

    async init(config) {
        if (!config) {
            const width = 1024;
            const height = 1024 * (2339 / 1654);
            config = {
                viewportSize: {width, height},
                paperSize: {
                    format: 'A4',
                    orientation: 'portrait',
                    width: width + 'px',
                    height: height + 'px'
                }
            };
        }
        const instance = await phantom.create();
        const page = await instance.createPage();

        Object.keys(config).map(prop => page.property(prop, config[prop]));

        this.page = page;
        this.emit('ready', this);
    }

    async render(target) {
        const status = await this.page.open(target);

        if (status === 'success') {
            this.emit('success', this);
            const renderParam = this.fnGetRenderParam(target);
            this.page.render(renderParam);
            this.emit('rendered', renderParam);
        } else {
            this.emit('error', this);
        }
    }
}
