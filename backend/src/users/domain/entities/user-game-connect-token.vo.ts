import crypto from 'crypto';

const TOKEN_SIZE_BYTES = 32;

export class UserGameConnectToken {
  constructor(private readonly value: string) {}

  public static generate(): UserGameConnectToken {
    const token = crypto.randomBytes(TOKEN_SIZE_BYTES).toString('hex');
    return new UserGameConnectToken(token);
  }

  public getValue(): string {
    return this.value;
  }

  public getHash(): string {
    return crypto.createHash('sha256').update(this.value).digest('hex');
  }

  public matchesHash(hash: string): boolean {
    const currentHash = this.getHash();

    return crypto.timingSafeEqual(
      Buffer.from(currentHash, 'hex'),
      Buffer.from(hash, 'hex')
    );
  }
}
