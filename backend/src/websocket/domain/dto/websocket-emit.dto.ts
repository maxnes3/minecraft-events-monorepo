export class WebSocketEmitDTO<T> {
  event: string;
  data: T;
  requestId?: string;
  status?: number;
}
