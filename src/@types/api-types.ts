/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PostUserRequest {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  instagramRef?: string;
  tiktokRef?: string;
  imageUrl?: string;
}

export interface PostUserResponse {
  userId: string;
}

export interface PutUserRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  instagramRef?: string;
  tiktokRef?: string;
  imageUrl?: string;
  roles?: string[];
}

export interface GetUserResponse {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  instagramRef?: string;
  tiktokRef?: string;
  imageUrl?: string;
  roles?: string[];
  keycloakUserId?: string;
  mollieCustomerId?: string;
  mollieCreatedAt?: string;
  mollieDashboardLink?: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ListUsersResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  users: GetUserResponse[];
}

export interface GetUserAccountResponse {
  id: string;
  username: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  instagramRef?: string;
  tiktokRef?: string;
  imageUrl?: string;
  roles?: string[];
}

export interface ListUserAccountsResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  users: GetUserAccountResponse[];
}

export interface PostProductRequest {
  imageUrls: string[];
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface PostProductResponse {
  productId: string;
}

export interface PutProductRequest {
  imageUrls: any[];
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface GetProductResponse {
  id: string;
  imageUrls: string[];
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ListProductsResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  products: GetProductResponse[];
}

export interface PostTestingRequest {
  testerIds: string[];
  productId: string;
}

export interface PostTestingResponse {
  testingId: string;
}

export interface PutTestingRequest {
  testerIds: any[];
}

export interface GetTestingResponse {
  id: string;
  testers: string[];
  creatorId: string;
  productId: string;
  status: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ListTestingsResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  testings: GetTestingResponse[];
}

export interface PostTestingCommentRequest {
  testingId: string;
  comment: string;
  type: string;
  fileUrls: string[];
}

export interface PostTestingCommentResponse {
  testingCommentId: string;
}

export interface GetTestingCommentResponse {
  id: string;
  fileUrls: string[];
  creatorId: string;
  testingId: string;
  message: string;
  type: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ListTestingCommentsResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  testingComments: GetTestingCommentResponse[];
}

export interface ListApplicationErrorsResponse {
  /** @example "3" */
  count: number;
  /** @example false */
  hasPreviousPage: boolean;
  /** @example true */
  hasNextPage: boolean;
  /** @example 1 */
  pageNumber: number;
  /** @example 1 */
  pageSize: number;
  /** @example 3 */
  totalPages: number;
  applicationErrors: GetApplicationErrorResponse[];
}

export interface GetApplicationErrorResponse {
  /** @example 12 */
  id: number;
  /** @example "969b0d62-b196-4001-b62c-3e386de63fd9" */
  userId: string;
  /** @example "Access to resource not allowed." */
  errorReason: string;
  /** @example "/api/v1" */
  source: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ExceptionResponse {
  /** A human-readable explanation specific to this occurrence of the problem */
  detail?: string;
  /** Exception details (e.g. validation result) */
  errors?: string[];
  /** The HTTP status code */
  status: number;
  /** A short, human-readable summary of the problem type */
  title: string;
  /** A URI reference that identifies the problem type */
  type: string;
}

/** @example {"status":400,"title":"The request was invalid","type":"https://tools.ietf.org/html/rfc7231#section-6.5.1"} */
export type BadRequestResponse = ExceptionResponse;

/** @example {"status":404,"title":"The specified resource was not found","type":"https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4"} */
export type NotFoundResponse = ExceptionResponse;

/** @example {"status":500,"title":"An error occurred while processing your request","type":"https://tools.ietf.org/html/rfc7231#section-6.6.1"} */
export type InternalErrorResponse = ExceptionResponse;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://localhost:3001/';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title 'Crochet by Jasmin' platform
 * @version 1.0.0
 * @baseUrl http://localhost:3001/
 *
 * The 'Crochet by Jasmin' platform enables buyers, sellers and testers to get the most out of crochet patterns.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description The application error will be queried by a given ID. If the application error cannot be found, an exception will be thrown.
     *
     * @tags Application error
     * @name GetApplicationErrorById
     * @summary Gets an application error by ID.
     * @request GET:/api/v1/application-errors/{applicationErrorId}
     * @secure
     */
    getApplicationErrorById: (applicationErrorId: string, params: RequestParams = {}) =>
      this.request<GetApplicationErrorResponse, NotFoundResponse>({
        path: `/api/v1/application-errors/${applicationErrorId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The application errors will be retrieved by a given user ID and returns a list of application errors.
     *
     * @tags Application error
     * @name ListApplicationErrorsByUserId
     * @summary Gets the application errors for a user ID.
     * @request GET:/api/v1/application-errors/users/{userId}
     * @secure
     */
    listApplicationErrorsByUserId: (
      userId: string,
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListApplicationErrorsResponse, any>({
        path: `/api/v1/application-errors/users/${userId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates a user by the given request body data.
     *
     * @tags User
     * @name PostUser
     * @summary Creates a user.
     * @request POST:/api/v1/users
     * @secure
     */
    postUser: (
      data: {
        /** @example "any" */
        roles?: any;
        /** @example "any" */
        email?: any;
        /** @example "any" */
        password?: any;
        /** @example "any" */
        firstName?: any;
        /** @example "any" */
        lastName?: any;
        /** @example "any" */
        username?: any;
        /** @example "any" */
        instagramRef?: any;
        /** @example "any" */
        tiktokRef?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostUserResponse, any>({
        path: `/api/v1/users`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of users.
     *
     * @tags User
     * @name ListUsers
     * @summary Gets the users.
     * @request GET:/api/v1/users
     * @secure
     */
    listUsers: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListUsersResponse, any>({
        path: `/api/v1/users`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Updates the user by the given request body data and user ID.
     *
     * @tags User
     * @name PutUser
     * @summary Updates the user.
     * @request PUT:/api/v1/users/{userId}
     * @secure
     */
    putUser: (
      userId: string,
      data: {
        /** @example "any" */
        email?: any;
        /** @example "any" */
        username?: any;
        /** @example "any" */
        firstName?: any;
        /** @example "any" */
        lastName?: any;
        /** @example "any" */
        instagramRef?: any;
        /** @example "any" */
        tiktokRef?: any;
        /** @example "any" */
        imageUrl?: any;
        /** @example "any" */
        roles?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/${userId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The user will be queried by a given ID. If the user cannot be found, an exception will be thrown.
     *
     * @tags User
     * @name GetUserById
     * @summary Gets an user by ID.
     * @request GET:/api/v1/users/{userId}
     * @secure
     */
    getUserById: (userId: string, params: RequestParams = {}) =>
      this.request<GetUserAccountResponse, NotFoundResponse>({
        path: `/api/v1/users/${userId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The user will be queried by a given ID. If the user cannot be found or the user ID is not related to the authenticated user, an exception will be thrown.
     *
     * @tags User
     * @name GetUser
     * @summary Gets the authenticated user.
     * @request GET:/api/v1/users/{userId}/me
     * @secure
     */
    getUser: (userId: string, params: RequestParams = {}) =>
      this.request<GetUserResponse, NotFoundResponse>({
        path: `/api/v1/users/${userId}/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates a product by the given request body data.
     *
     * @tags Product
     * @name PostProduct
     * @summary Creates a product.
     * @request POST:/api/v1/products
     * @secure
     */
    postProduct: (
      data: {
        /** @example "any" */
        imageUrls?: any;
        /** @example "any" */
        title?: any;
        /** @example "any" */
        description?: any;
        /** @example "any" */
        category?: any;
        /** @example "any" */
        price?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostProductResponse, any>({
        path: `/api/v1/products`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of products.
     *
     * @tags Product
     * @name ListProducts
     * @summary Gets the products.
     * @request GET:/api/v1/products
     * @secure
     */
    listProducts: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListProductsResponse, any>({
        path: `/api/v1/products`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Updates the product by the given request body data and product ID.
     *
     * @tags Product
     * @name PutProduct
     * @summary Updates the product.
     * @request PUT:/api/v1/products/{productId}
     * @secure
     */
    putProduct: (
      productId: string,
      data: {
        /** @example "any" */
        imageUrls?: any;
        /** @example "any" */
        title?: any;
        /** @example "any" */
        description?: any;
        /** @example "any" */
        category?: any;
        /** @example "any" */
        price?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/products/${productId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The product will be queried by a given ID. If the product cannot be found, an exception will be thrown.
     *
     * @tags Product
     * @name GetProductById
     * @summary Gets a product by ID.
     * @request GET:/api/v1/products/{productId}
     * @secure
     */
    getProductById: (productId: string, params: RequestParams = {}) =>
      this.request<GetProductResponse, NotFoundResponse>({
        path: `/api/v1/products/${productId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query deletes a product by a given ID.
     *
     * @tags Product
     * @name DeleteProduct
     * @summary Deletes the products.
     * @request DELETE:/api/v1/products/{productId}
     * @secure
     */
    deleteProduct: (productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/products/${productId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description The query returns a list of products of a given user ID.
     *
     * @tags Product
     * @name ListProductsByUserId
     * @summary Gets the products by user ID.
     * @request GET:/api/v1/products/users/{userId}
     * @secure
     */
    listProductsByUserId: (
      userId: string,
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListProductsResponse, any>({
        path: `/api/v1/products/users/${userId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates a testing by the given request body data.
     *
     * @tags Testing
     * @name PostTesting
     * @summary Creates a testing.
     * @request POST:/api/v1/testings
     * @secure
     */
    postTesting: (
      data: {
        /** @example "any" */
        productId?: any;
        /** @example "any" */
        testerIds?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostTestingResponse, any>({
        path: `/api/v1/testings`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of testings.
     *
     * @tags Testing
     * @name ListTestings
     * @summary Gets the testings.
     * @request GET:/api/v1/testings
     * @secure
     */
    listTestings: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListTestingsResponse, any>({
        path: `/api/v1/testings`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Updates the testing by the given request body data and testing ID.
     *
     * @tags Testing
     * @name PutTesting
     * @summary Updates the testing.
     * @request PUT:/api/v1/testings/{testingId}
     * @secure
     */
    putTesting: (
      testingId: string,
      data: {
        /** @example "any" */
        testerIds?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/testings/${testingId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The testing will be queried by a given ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Testing
     * @name GetTestingById
     * @summary Gets a testing by ID.
     * @request GET:/api/v1/testings/{testingId}
     * @secure
     */
    getTestingById: (testingId: string, params: RequestParams = {}) =>
      this.request<GetTestingResponse, NotFoundResponse>({
        path: `/api/v1/testings/${testingId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query deletes a testing by a given ID.
     *
     * @tags Testing
     * @name DeleteTesting
     * @summary Deletes the testings.
     * @request DELETE:/api/v1/testings/{testingId}
     * @secure
     */
    deleteTesting: (testingId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/testings/${testingId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description The query returns a list of testings of a given user ID.
     *
     * @tags Testing
     * @name ListTestingsByUserId
     * @summary Gets the testings by user ID.
     * @request GET:/api/v1/testings/users/{userId}
     * @secure
     */
    listTestingsByUserId: (
      userId: string,
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListTestingsResponse, any>({
        path: `/api/v1/testings/users/${userId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates a testing comment by the given request body data.
     *
     * @tags Testing comment
     * @name PostTestingComment
     * @summary Creates a testing comment.
     * @request POST:/api/v1/testing-comments
     * @secure
     */
    postTestingComment: (
      data: {
        /** @example "any" */
        testingId?: any;
        /** @example "any" */
        message?: any;
        /** @example "any" */
        fileUrls?: any;
        /** @example "any" */
        type?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostTestingCommentResponse, any>({
        path: `/api/v1/testing-comments`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of testing comment of a given testing ID.
     *
     * @tags Testing comment
     * @name ListTestingCommentsByTestingId
     * @summary Gets the testing comments by testing ID.
     * @request GET:/api/v1/testing-comments/testings/{testingId}
     * @secure
     */
    listTestingCommentsByTestingId: (
      testingId: string,
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListTestingCommentsResponse, any>({
        path: `/api/v1/testing-comments/testings/${testingId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
}
