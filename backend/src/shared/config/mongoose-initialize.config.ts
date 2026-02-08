import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { publicRuntimeConfig } from './runtime.config';

export const initMongooseAsyncConfig: MongooseModuleAsyncOptions = {
  useFactory: () => ({
    uri: publicRuntimeConfig.mongodb.uri,
    retryAttempts: 3,
    retryDelay: 1000
  })
};
