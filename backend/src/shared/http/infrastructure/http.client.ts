import { Injectable } from '@nestjs/common';
import { HttpService as NestAxiosHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IHttpClient } from '../domain/http-client.interface';
import { HttpRequestConfig } from '../domain/http-request-config.interface';
import { HttpResponse } from '../domain/http-response.interface';

@Injectable()
export class HttpClient implements IHttpClient {
  constructor(private readonly httpService: NestAxiosHttpService) {}

  public async get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await firstValueFrom(this.httpService.get<T>(url, config));

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
    const response = await firstValueFrom(
      this.httpService.post<T>(url, data, config)
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
    const response = await firstValueFrom(
      this.httpService.put<T>(url, data, config)
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
    const response = await firstValueFrom(
      this.httpService.patch<T>(url, data, config)
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
    const response = await firstValueFrom(
      this.httpService.delete<T>(url, config)
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>
    };
  }
}
