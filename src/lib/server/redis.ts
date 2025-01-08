import { REDIS_URI } from '$env/static/private';
import { Redis } from 'ioredis';

export const redis = new Redis(REDIS_URI);

export async function getParsedCacheData(
    key: string,
    setHeaders: (headers: Record<string, string>) => void,
    cached: string
) {
    const ttl = await redis.ttl(key);
    setHeaders({ 'cache-control': `max-age=${ttl}` });
    return JSON.parse(cached!);
}
