import { IStreamingPlatformTokensDTO } from './dto/streaming-platform-tokens.interface';
import { IStreamingPlaftormUserDTO } from './dto/streaming-platform-user.dto';

export interface IStreamingPlatformMapper {
  toStreamingPlatformTokensDTO(data: any): IStreamingPlatformTokensDTO;
  toStreamingPlatformUserDTO(data: any): IStreamingPlaftormUserDTO;
}
