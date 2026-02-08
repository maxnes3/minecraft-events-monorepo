export class WebSocketEventPayload<T = any> {
  userId: string;
  socketId: string;
  data: T;
}

export class WebSocketEventResult {
  success: boolean;
}

export type WebSocketHandler<T = any> = (
  payload: WebSocketEventPayload<T>
) => Promise<WebSocketEventResult> | WebSocketEventResult;

export class WebSocketHandlers {
  [event: string]: WebSocketHandler<any>;
}
