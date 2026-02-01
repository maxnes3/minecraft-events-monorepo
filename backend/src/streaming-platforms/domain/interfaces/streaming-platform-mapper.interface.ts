import { StreamingPlatformTokensDTO } from '../dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '../dto/streaming-platform-user.dto';
import { StreamingPlaftormStreamDTO } from '../dto/streaming-platform-stream.dto';

export interface IStreamingPlatformMapper {
  toStreamingPlatformTokensDTO(data: any): StreamingPlatformTokensDTO;
  toStreamingPlatformUserDTO(data: any): StreamingPlaftormUserDTO;
  toStreamingPlatformStreamDTO(data: any): StreamingPlaftormStreamDTO;
}
