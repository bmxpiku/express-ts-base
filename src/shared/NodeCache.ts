import NodeCache from 'node-cache';

const nodeCache = new NodeCache({
  stdTTL: Number(process.env.NODE_CACHE_TTL || 1800),
  checkperiod: Number(process.env.NODE_CACHE_CHECK_PERIOD || 3600),
});

export default nodeCache;

// <TODO> move to readme:
// Usage
// let result = nodeCache.get('cache_key');
//
// if (!result) {
//     result = await db.collection.findOne({});
//
//     nodeCache.set('cache_key', result);
// }
