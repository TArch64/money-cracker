export interface IRetryPerformOptions {
  tryCount: number;
  cause?: Error;
}

export interface IRetryOptions<V> {
  perform: (options: IRetryPerformOptions) => Promise<V>;
  limit: number;
}

export function withRetries<V>(options: IRetryOptions<V>): Promise<V> {
  async function tryPerform(performOptions: IRetryPerformOptions): Promise<V> {
    try {
      return await options.perform(performOptions);
    } catch (error) {
      console.error(error);

      if (performOptions.tryCount >= options.limit) {
        throw error;
      }

      return tryPerform({
        tryCount: performOptions.tryCount + 1,
        cause: error as Error,
      });
    }
  }

  return tryPerform({ tryCount: 0 });
}
