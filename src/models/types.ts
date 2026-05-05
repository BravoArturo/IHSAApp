export type ResponseType<T, Y> =
  | {
      message: 'success';
      response: T;
    }
  | { message: 'error'; error: Y };
