import asyncRedis from 'async-redis';

const Redis = {
  // @ts-ignore: its not undefined while used wisely
  client: undefined,
  async init(): Promise<void> {
    const redisClient = await asyncRedis.createClient(
      {
        url: String(process.env.REDIS_URL || ''),
      },
    );
    console.log('Redis client created');

    redisClient.on('error', (err: any) => {
      console.error('Redis error:', err);
    });

    this.client = redisClient;
  },
};
export default Redis;

export function save(key: string, value: unknown, ttl: number): Promise<void> {
  return Redis.client.set(key, JSON.stringify(value), 'EX', ttl);
}

export async function load(key: string): Promise<any> {
  const data = await Redis.client.get(key);
  if (!data) return undefined;
  return JSON.parse(data);
}
