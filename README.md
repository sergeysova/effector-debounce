# Effector Debounce

[![npm bundle size](https://img.shields.io/bundlephobia/min/effector-debounce)](https://bundlephobia.com/result?p=effector-debounce)

> **Deprecated**: Use [patronum](github.com/sergeysova/patronum) instead

https://codesandbox.io/s/effector-throttle-debounce-w32tk

## Installation

```bash
npm install --save effector effector-debounce

# or

yarn add effector effector-debounce
```

## Usage

Create event that should be debounced:

```ts
import { createEvent } from 'effector';

const someHappened = createEvent<number>();
```

Create debounced event from it:

```ts
import { createDebounce } from 'effector-debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const debounced = createDebounce(someHappened, DEBOUNCE_TIMEOUT_IN_MS);
```

To test that original event is correctly debounced you can add watcher:

```ts
debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
```

Also you can use `Effect` and `Store` as trigger. `createDebounce` always returns `Event`:

```ts
const event = createEvent<number>();
const debouncedEvent: Event<number> = createDebounce(event, 100);

const fx = createEffect<number, void>();
const debouncedEffect: Event<number> = createDebounce(fx, 100);

const $store = createStore<number>(0);
const debouncedStore: Event<number> = createDebounce($store, 100);
```

### Change name

```ts
const trigger = createEvent();
const debounced = createDebounce(trigger, 100);

// Now debounced var has `triggerDebounceTick` name
```

To change name:

```ts
const trigger = createEvent();
const debounced = createDebounce(trigger, 100, { name: 'Hello' });

// Now debounced var has `HelloDebounceTick` name
```
