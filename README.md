phantomjs-render-worker
===

## method

constructor(fnGetRenderParam: targetUrl => string, config?);

> fnGetRenderParam

function should returns string like `filename.extension`, extension means result file format you want(eg, `result.pdf`)

```js
fnGetRenderParam = (url) => {
    return 'filename.pdf';
}
```

> default config

```js
{
    viewportSize: {1024, 1024 * (2339 / 1654)},
    paperSize: {
        format: 'A4',
        orientation: 'portrait',
        width: 1024 + 'px',
        height: 1024 * (2339 / 1654) + 'px'
    }
};
```

render

## event

> ready

when phantomjs create page and finish page configuration

> success

when succeed page.open

> error

when page.open error

> rendered

when succeed to generate render file

## usage

```js
import os from 'os';
import Worker from 'phantomjs-render-worker';

const cores = os.cpus().length;
const getId = ((id) => () => id++)(0);

const targets = ['http://google.com', 'http://facebook.com', 'http://naver.com'];
const workers = [];
const success = worker => {
    const nextWork = targets.shift();
    nextWork && worker.render(nextWork);
};
const rendered = renderParam => !Array.isArray(renderParam) && console.log(`[rendered] ${renderParam}`);

for (let i = 0, worker;i < cores; i++) {
    worker = new Worker(() => `${getId()}.pdf`);
    worker.on('success', success);
    worker.on('rendered', rendered);
    worker.on('ready', success);
    workers.push(worker);
}
```

## todo

* render via stream
* kill worker

## license

MIT
