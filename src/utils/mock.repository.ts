import { EntityRepository } from '@mikro-orm/core';

export function createMockRepository<T extends EntityRepository<any>>() {
  const persist = jest.fn() as any;
  const flush = jest.fn() as any;

  return {
    persist: persist as jest.Mock,
    flush: flush as jest.Mock,
    repo: {
      persist,
      flush,
      persistAndFlush: async (x) => {
        persist(x);
        flush();
      },
    } as Partial<T>,
  };
}
