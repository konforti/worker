# worker

> Move a function into a web worker.

> Supports async function.

> Function params can be any serializable type or a function.

## Installation

```bash
    npm i -S @konforti/worker
```

```bash
    yarn add @konforti/worker
```

## Usage

```js
import worker from '@konforti/worker';
```

```js
// Function in worker

function fibonacci(num) {
    let a = 1;
    let b = 0;
    let temp;
    while (num >= 0) {
        temp = a;
        a = a + b;
        b = temp;
        num--;
    }
    return b;
}

const fibInWorker = worker(fibonacci);
fibInWorker(3333).then(res => console.log(res));
```

```js
// Async function in worker

const getRepos = worker(async username => {
    const url = `https://api.github.com/users/${username}/repos`;
    const res = await fetch(url);
    const repos = await res.json();
    return repos.map(r => r.full_name);
});

getRepos('konforti').then(res => console.log(res));
```

```js
// Pass a callback function as argument

const doSomething = callback => `First we'll take Manhattan, ${callback()}`;
const doNext = () => "Then we'll take Berlin.";
const justDoIt = worker(doSomething);
justDoIt(doNext).then(res => console.log(res));
```

```js
// Inject imported function into worker scope

import mathModule from './math.js';

const runInWorker = (sum, times) => {
    const a = sum(2, 3);
    const b = times(2, 3);
    return sum(a, b);
};

const run = worker(runInWorker);
run(mathModule.sum, mathModule.times).then(res => console.log(res));
```

## Limitations

The function and any argument passes cannot rely on its surrounding scope, since it is executed in an isolated context.
