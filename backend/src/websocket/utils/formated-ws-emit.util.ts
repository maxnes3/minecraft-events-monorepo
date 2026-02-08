import { WebSocketEmitDTO } from '../application/dto/websocket-emit.dto';
import { WebSocketConnectedDTO } from '../application/dto/websocket-connected.dto';
import { WebSocketErrorDTO } from '../application/dto/websocket-error.dto';
import { WebSocketPublishEvents } from '../domain/websocket-events.enums';

export class WebSocketEventDataMap {
  [WebSocketPublishEvents.CONNECTED]: WebSocketConnectedDTO;
  [WebSocketPublishEvents.ERROR]: WebSocketErrorDTO;
}

export type WebSocketEventData<T extends WebSocketPublishEvents> =
  T extends keyof WebSocketEventDataMap ? WebSocketEventDataMap[T] : never;

export function formatWsEmit<T extends WebSocketPublishEvents>({
  event,
  data,
  requestId,
  status
}: {
  event: T;
  data: WebSocketEventData<T>;
  requestId?: string;
  status?: number;
}): WebSocketEmitDTO<WebSocketEventData<T>> {
  return {
    event,
    data,
    status,
    requestId
  };
}
