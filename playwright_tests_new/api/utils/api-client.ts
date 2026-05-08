import { request, type APIRequestContext, type APIResponse } from '@playwright/test';
import { ensureApiStorageState, resolveBaseUrl } from './api-auth';

type ApiResponse<T = unknown> = {
  data: T;
  headers: Record<string, string>;
  status: number;
  statusText: string;
};

type RequestOptions = {
  data?: unknown;
  headers?: Record<string, string>;
  throwOnError?: boolean;
};

export class ManageOrgApiClient {
  public constructor(private readonly context: APIRequestContext) {}

  public async get<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const response = await this.context.get(url, {
      failOnStatusCode: options.throwOnError ?? false,
      headers: options.headers
    });
    return this.toApiResponse<T>(response);
  }

  public async post<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const response = await this.context.post(url, {
      data: options.data,
      failOnStatusCode: options.throwOnError ?? false,
      headers: options.headers
    });
    return this.toApiResponse<T>(response);
  }

  public async dispose(): Promise<void> {
    await this.context.dispose();
  }

  private async toApiResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    const contentType = response.headers()['content-type'] ?? '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => undefined)
      : await response.text().catch(() => undefined);
    return {
      data: data as T,
      headers: response.headers(),
      status: response.status(),
      statusText: response.statusText()
    };
  }
}

export const createAnonymousApiClient = async (): Promise<ManageOrgApiClient> => {
  const context = await request.newContext({
    baseURL: resolveBaseUrl(),
    ignoreHTTPSErrors: true
  });
  return new ManageOrgApiClient(context);
};

export const createAuthenticatedApiClient = async (workerIndex: number): Promise<ManageOrgApiClient> => {
  const storageState = await ensureApiStorageState(workerIndex);
  const context = await request.newContext({
    baseURL: resolveBaseUrl(),
    ignoreHTTPSErrors: true,
    storageState
  });
  return new ManageOrgApiClient(context);
};
