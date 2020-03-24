import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { createDebounce } from '../src';

test('debounce works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = createDebounce(trigger, 40);

  $counter.on(debounced, (value) => value + 1);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-6pi12w": 1,
    }
  `);
});

test('debounce do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent<number>();

  const debounced = createDebounce(trigger, 40);

  $counter.on(debounced, (value, param) => value + param);

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "5si3ab": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "5si3ab": 200,
    }
  `);
});

test('debounce do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent<number>();

  const debounced = createDebounce(trigger, 40);

  $counter.on(debounced, (value, param) => value + param);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-3or3fj": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});
