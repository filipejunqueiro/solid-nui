export interface ISendArgs<T = unknown> {
  action: string;
  mockData?: T;
}

export interface ITrigger<T = unknown> {
  id: string;
  data?: T;
}

export interface IReceiveArgs<TData = unknown> {
  action: string;
  callback: (data: TData) => void;
}

export interface IEventPayload<T = unknown> {
  action: string;
  data: T;
}
