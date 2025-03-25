export interface IAsyncQueueTask<T> {
  index: number;
  item: T;
}

export type QueueProcessFn<T> = (task: IAsyncQueueTask<T>) => Promise<void>;

export interface IAsyncQueueOptions<T> {
  queue: T[];
  maxConcurrent: number;
  process: QueueProcessFn<T>;
}

export class ImportPhotoQueue<T> {
  static async process<T>(options: IAsyncQueueOptions<T>): Promise<void> {
    await new ImportPhotoQueue(
      options.queue.map((item, index) => ({ item, index })),
      options.maxConcurrent,
      options.process,
    ).process();
  }

  private readonly processing: Set<Promise<void>> = new Set();
  private readonly waiter: Promise<void>;
  private release!: () => void;

  private constructor(
    private readonly queue: IAsyncQueueTask<T>[],
    private readonly maxConcurrent: number,
    private readonly processFn: QueueProcessFn<T>,
  ) {
    this.waiter = new Promise((resolve) => this.release = resolve);
  }

  async process(): Promise<void> {
    while (this.queue.length > 0 && this.processing.size < this.maxConcurrent) {
      this.processNext();
    }

    await this.waiter;
  }

  private processNext(): void {
    if (!this.queue.length) return;

    const item = this.queue.shift()!;

    const processPromise = (async () => {
      try {
        await this.processFn(item);
      } catch (error) {
        console.error(`Error processing item:`, error);
      } finally {
        this.processing.delete(processPromise!);

        if (this.queue.length > 0) {
          this.processNext();
        }

        if (!this.processing.size) {
          this.release();
        }
      }
    })();

    this.processing.add(processPromise);
  }
}
