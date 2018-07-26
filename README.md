# worker

> Move a function into a web worker.

> Support async function, arrow function or regular function.

> Function params can be any serialize type or a function.

## Installation

```bash
    npm i -S @konforti/worker
```

or

```bash
    yarn add @konforti/worker
```

## Usage

```js
import worker from '@konforti/worker';
```

```js
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
fibInWorker(33).then(res => console.log(res));
```

```js
const getRepos = worker(async username => {
    const url = `https://api.github.com/users/${username}/repos`;
    const res = await fetch(url);
    const repos = await res.json();
    return repos.map(r => r.full_name);
});

getRepos('konforti').then(res => console.log(res));
```

```js
const doSomething = callback => `First we'll take Manhattan, ${callback()}`;
const doNext = () => "Then we'll take Berlin.";
const justDoIt = worker(doSomething);
justDoIt(doNext).then(res => console.log(res));
```

## Limitations

The function and any argument passes cannot rely on its surrounding scope, since it is executed in an isolated context.
