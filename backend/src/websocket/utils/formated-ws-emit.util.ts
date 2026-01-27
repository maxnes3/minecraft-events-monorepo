import { WebSocketConnectedDTO } from '../domain/dto/websocket-connected.dto';
import { WebSocketErrorDTO } from '../domain/dto/websocket-error.dto';
import { WebSocketEvents } from '../domain/websocket-events.enums';

export class WebSocketEventDataMap {
  [WebSocketEvents.CONNECTED]: WebSocketConnectedDTO;
  [WebSocketEvents.ERROR]: WebSocketErrorDTO;
}

export type WebSocketEventData<T extends WebSocketEvents> =
  T extends keyof WebSocketEventDataMap ? WebSocketEventDataMap[T] : never;

export function formatWsEmit<T extends WebSocketEvents>({
  event,
  data
}: {
  event: T;
  data: WebSocketEventData<T>;
}) {
  return {
    event,
    data
  };
}
