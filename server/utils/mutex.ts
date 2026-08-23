/**
 * High-performance In-Memory Product Mutex Lock
 * Prevents race conditions during concurrent checkouts on the exact same product SKU / ID.
 */
class ProductMutex {
  private locks: Map<string, Promise<void>> = new Map();

  /**
   * Acquire locks for all requested product IDs in a deterministic sorted order
   * to avoid deadlocks.
   */
  async acquire(productIds: string[]): Promise<() => void> {
    const sortedIds = Array.from(new Set(productIds)).sort();
    const releases: (() => void)[] = [];

    for (const id of sortedIds) {
      let releaseLock: () => void = () => {};
      const currentLock = this.locks.get(id);

      const newLock = new Promise<void>((resolve) => {
        releaseLock = () => {
          this.locks.delete(id);
          resolve();
        };
      });

      if (currentLock) {
        await currentLock;
      }

      this.locks.set(id, newLock);
      releases.push(releaseLock);
    }

    // Return combined release function
    return () => {
      releases.forEach(release => release());
    };
  }
}

export const inventoryMutex = new ProductMutex();
