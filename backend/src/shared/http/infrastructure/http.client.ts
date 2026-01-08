import { Injectable } from '@nestjs/common';
import { HttpService as NestAxiosHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IHttpClient } from '../domain/http-client.interface';
import { HttpRequestConfig } from '../domain/http-request-config.interface';
import { HttpResponse } from '../domain/http-response.interface';

@Injectable()
export class HttpClient implements IHttpClient {
  private defaultHeaders: Map<string, string> = new Map();
  private defaultConfig: Partial<HttpRequestConfig> = {};

  constructor(private readonly httpService: NestAxiosHttpService) {}

  public async get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalConfig = this.buildFinalConfig(config);
    const response = await firstValueFrom(
      this.httpService.get<T>(url, finalConfig)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalConfig = this.buildFinalConfig(config);
    const response = await firstValueFrom(
      this.httpService.post<T>(url, data, finalConfig)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalConfig = this.buildFinalConfig(config);
    const response = await firstValueFrom(
      this.httpService.put<T>(url, data, finalConfig)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalConfig = this.buildFinalConfig(config);
    const response = await firstValueFrom(
      this.httpService.patch<T>(url, data, finalConfig)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  public async delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalConfig = this.buildFinalConfig(config);
    const response = await firstValueFrom(
      this.httpService.delete<T>(url, finalConfig)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  public setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders.set(key, value);
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      this.defaultHeaders.set(key, value);
    });
  }

  public removeDefaultHeader(key: string): void {
    this.defaultHeaders.delete(key);
  }

  public clearDefaultHeaders(): void {
    this.defaultHeaders.clear();
  }

  public setDefaultConfig(config: Partial<HttpRequestConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  public clearDefaultConfig(): void {
    this.defaultConfig = {};
    this.defaultHeaders.clear();
  }

  private buildFinalConfig(config?: HttpRequestConfig): HttpRequestConfig {
    const finalHeaders: Record<string, string> = {};

    this.defaultHeaders.forEach((value, key) => {
      finalHeaders[key] = value;
    });

    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        finalHeaders[key] = value;
      });
    }

    return {
      ...this.defaultConfig,
      ...config,
      headers: finalHeaders
    };
  }
}
