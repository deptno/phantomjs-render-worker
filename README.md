# phantomjs-render-worker [![Build Status](https://travis-ci.org/deptno/phantomjs-render-worker.svg?branch=master)](https://travis-ci.org/deptno/phantomjs-render-worker)
[![npm](https://img.shields.io/npm/dt/phantomjs-render-worker.svg?style=for-the-badge)](https://www.npmjs.com/package/phantomjs-render-worker)

## method

constructor(format? = 'pdf', delay? = 1, poll = (() => true), config?)

> format

rendered file format you want(eg, `pdf`, `png`)

> delay

second, polling period

> poll

repeat function to check render is done,
this function runs client side
if this function returns TRUE, the render worker will start rendering

```js
() => window.__renderable === true;
```

>  config

default config is below

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

render(url: string, file: string, poll?: () => boolean): Promise

> url

url want to render

> file

rendered file name

> poll

override default polling function

## event

> init

when phantomjs create page and finish page configuration

> rendering

when start rendering, it means polling function returns TRUE

> rendered

when succeed to generate render file

> error

when page.open error

## usage

### event driven

```js
import Worker from 'phantomjs-render-worker';

const targets = ['http://google.com', 'http://facebook.com'];
const worker = new Worker('pdf');
const {init, rendered, rendering, error } = Worker.event;
const success = file => {
    const nextWork = targets.shift();
    nextWork && worker.render(nextWork, '/dev/null', (() => true));
};

worker.on(init, success);
worker.on(rendered, success);
```

### promise driven

```js
const targets = ['http://google.com', 'http://facebook.com'];
const worker = new Worker('pdf');
const {init, rendered, rendering, error } = Worker.event;

worker.on(init, function loopback() => {
    const nextWork = targets.shift();
    if (nextWork) {
        worker.render(nextWork, '/dev/null', (() => true)).then(loopback);
    }
});
worker.on(rendered, (filename) => console.log(`${filename} generated`);
```

## todo

* render via stream
* kill worker

## related

- https://github.com/deptno/render-worker-pool-manager

## license

MIT
