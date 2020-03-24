import { is, createEffect, forward, createEvent, Unit, Event } from 'effector';

export function createDebounce<T>(
  callee: Unit<T>,
  timeout: number,
  { name = 'unknown' } = {},
): Event<T> {
  if (!is.unit(callee)) throw new Error('callee must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  let rejectPromise = (): void => undefined;
  let timeoutId: number;
  const tick = createEvent<T>(`${name}DebounceTick`);

  const timer = createEffect<T, T>(`${name}DebounceTimer`).use(
    (parameter) =>
      new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = (setTimeout(resolve, timeout, parameter) as any) as number;
      }),
  );

  timer.watch(() => {
    clearTimeout(timeoutId);
    rejectPromise();
  });

  forward({
    from: callee,
    to: timer,
  });

  forward({
    from: timer.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}
