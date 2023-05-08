export interface Event<T> {
  messageId: string;
  message: T;
  sentTime: Date;
}
