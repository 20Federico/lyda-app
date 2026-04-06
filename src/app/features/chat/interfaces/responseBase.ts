export interface ResponseBase<T> {
  status: number;
  body: T;
}
