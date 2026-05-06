export type ResponseAPIType<T, Y> =
  | {
      message: 'success';
      response: T;
    }
  | { message: 'error'; error: Y };
