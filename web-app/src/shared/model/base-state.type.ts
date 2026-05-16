export interface BaseState<T = any> {
  value: T | undefined;
  isFetched: boolean;
}
