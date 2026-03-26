export interface SendArgs<T = unknown> {
  action: string;
  data?: T;
}

export interface ReceiveArgs<T = unknown> {
  action: string;
  callback: (data: T) => void;
}
