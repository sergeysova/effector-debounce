import 'regenerator-runtime/runtime';
import { createStore, createEvent, createEffect } from 'effector';
import { createDebounce } from '../src';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('event', () => {
  test('debounce event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce event with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounced event triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced event works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });
});

describe('effect', () => {
  test('debounce effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce effect with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounced effect triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced effect works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = createDebounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });
});

describe('store', () => {
  test('debounce store and pass values', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const $store = createStore(0);

    $store.on(trigger, (_, value) => value);

    const debounced = createDebounce($store, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });
});
