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

export interface PostSubscriptionRequest {
  paypalSubscriptionId: string;
}

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
  paypalEmail?: string;
}

export interface PostUserResponse {
  userId: string;
}

export interface PutUserRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  instagramRef?: string;
  tiktokRef?: string;
  imageUrl?: string;
  roles?: string[];
  paypalEmail?: string;
}

export interface PutUserPasswordRequest {
  password?: string;
}

export interface PutGalleryImagesRequest {
  galleryImages: string[];
}

export interface GetUserResponse {
  id: string;
  email: string;
  username: string;
  description?: string;
  galleryImages: string[];
  isActive: boolean;
  isSponsored: boolean;
  firstName?: string;
  lastName?: string;
  instagramRef?: string;
  tiktokRef?: string;
  paypalEmail?: string;
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
  isSponsored: boolean;
  firstName?: string;
  lastName?: string;
  description?: string;
  galleryImages: string[];
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
  isFree: boolean;
  patternPdfsBase64: {
    base64: string;
    language: string;
  }[];
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
  isFree: boolean;
}

export interface GetProductResponse {
  id: string;
  imageUrls: string[];
  title: string;
  description: string;
  category: string;
  price: number;
  isFree: boolean;
  status: string;
  creatorId: string;
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
  testerIds?: any[];
  /** @example "neutral" */
  theme?: string;
}

export interface GetTestingResponse {
  id: string;
  testerIds?: string[];
  testers?: GetUserAccountResponse[];
  /** @example "neutral" */
  theme: string;
  creatorId: string;
  creator: GetUserAccountResponse;
  productId: string;
  product: GetProductResponse;
  status: string;
  lastComment?: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  lastCommentCreatedAt?: string;
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
  files: {
    url: string;
    mimeType: string;
  }[];
}

export interface GetTestingCommentResponse {
  id: string;
  files: {
    url: string;
    mimeType: string;
  }[];
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

export interface GetTesterApplicationResponse {
  user: GetUserAccountResponse;
  testing: GetTestingResponse;
  assignedBy: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  assignedAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  updatedAt: string;
}

export interface ListTesterApplicationsResponse {
  /** @example "3" */
  count: number;
  /** @example "3" */
  totalCount: number;
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
  testingsOnUsers: GetTesterApplicationResponse[];
}

export interface PostOrderRequest {
  productId: string;
}

export interface PostOrderResponse {
  orderId: string;
  paypalOrderId: string;
  captureLink: string;
}

export interface GetOrderResponse {
  id: string;
  seller: GetUserAccountResponse;
  customer: GetUserAccountResponse;
  amount: number;
  currency: string;
  paypalFee: number;
  paypalFeeCurrency: string;
  platformFee: number;
  platformFeeCurrency: string;
  status: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImageUrls: string[];
  productPrice: number;
  orderPatternPdfs: {
    patternPdfId: string;
    language: string;
  }[];
  paypalCaptureLink: string;
  paypalOrderId: string;
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

export interface ListOrdersResponse {
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
  orders: GetOrderResponse[];
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
        /** @example "any" */
        paypalEmail?: any;
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
        description?: any;
        /** @example "any" */
        instagramRef?: any;
        /** @example "any" */
        tiktokRef?: any;
        /** @example "any" */
        imageUrl?: any;
        /** @example "any" */
        paypalEmail?: any;
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
     * @description The user will be queried by a given ID or username. If the user cannot be found, an exception will be thrown.
     *
     * @tags User
     * @name GetUserById
     * @summary Gets an user by ID or username.
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
     * @description Updates the user password by the given request body data and user ID.
     *
     * @tags User
     * @name PutUserPassword
     * @summary Updates the users password.
     * @request PUT:/api/v1/users/{userId}/password
     * @secure
     */
    putUserPassword: (
      userId: string,
      data: {
        /** @example "any" */
        password?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/${userId}/password`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Adds gallery images by the given request body data and user ID.
     *
     * @tags User
     * @name PutGalleryImages
     * @summary Adds gallery images.
     * @request PUT:/api/v1/users/{userId}/gallery
     * @secure
     */
    putGalleryImages: (
      userId: string,
      data: {
        /** @example "any" */
        galleryImages?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/${userId}/gallery`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes a gallery image by the given query parameter data and user ID.
     *
     * @tags User
     * @name DeleteGalleryImage
     * @summary Deletes a gallery image.
     * @request DELETE:/api/v1/users/{userId}/gallery
     * @secure
     */
    deleteGalleryImage: (
      userId: string,
      query?: {
        /** The image to delete. */
        imageUrl?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/${userId}/gallery`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description The user will be queried by a given ID or username. If the user cannot be found or the user ID is not related to the authenticated user, an exception will be thrown.
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
        /** @example "any" */
        isFree?: any;
        /** @example "any" */
        patternPdfsBase64?: any;
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
        /** The query for a full text search. */
        q?: string;
        /** The status of the product. */
        status?: string;
        /** List of categories to filter products. */
        categories?: string[];
        /** The minimum price of a product to filter. */
        minPrice?: number;
        /** The maximum price of a product to filter. */
        maxPrice?: number;
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
        isFree?: any;
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
        /** @example "any" */
        theme?: any;
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
     * @description The testing will be queried by a given ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Testing
     * @name ApplyTesting
     * @summary Applies to a testing by ID.
     * @request POST:/api/v1/testings/{testingId}/apply
     * @secure
     */
    applyTesting: (testingId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/testings/${testingId}/apply`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description The tester applications will be queried by a given testing ID.
     *
     * @tags Testing
     * @name ListTesterApplications
     * @summary List tester applications by testing ID.
     * @request GET:/api/v1/testings/{testingId}/applications
     * @secure
     */
    listTesterApplications: (
      testingId: string,
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
        /** The order direction. */
        direction?: string;
        /** The property key to sort by. */
        sortKey?: string;
        /** Properties to filter by. */
        filter?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ListTesterApplicationsResponse, any>({
        path: `/api/v1/testings/${testingId}/applications`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The testing will be queried by a given ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Testing
     * @name ApproveTesting
     * @summary Approves a testing by ID.
     * @request PUT:/api/v1/testings/{testingId}/approve
     * @secure
     */
    approveTesting: (testingId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/testings/${testingId}/approve`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description The testing will be queried by a given ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Testing
     * @name DeclineTesting
     * @summary Declines a testing by ID.
     * @request PUT:/api/v1/testings/{testingId}/decline
     * @secure
     */
    declineTesting: (testingId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/testings/${testingId}/decline`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description The testing will be queried by a given ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Testing
     * @name AbortTesting
     * @summary Aborts a testing by ID.
     * @request PUT:/api/v1/testings/{testingId}/abort
     * @secure
     */
    abortTesting: (testingId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/testings/${testingId}/abort`,
        method: 'PUT',
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
     * @description The query returns a testing of a given product ID.
     *
     * @tags Testing
     * @name GetTestingByProductId
     * @summary Gets the testings by product ID.
     * @request GET:/api/v1/testings/products/{productId}
     * @secure
     */
    getTestingByProductId: (productId: string, params: RequestParams = {}) =>
      this.request<GetTestingResponse, any>({
        path: `/api/v1/testings/products/${productId}`,
        method: 'GET',
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
        comment?: any;
        /** @example "any" */
        files?: any;
        /** @example "any" */
        type?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTestingCommentResponse, any>({
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

    /**
     * @description Creates an order by the given request body data.
     *
     * @tags Order
     * @name PostOrder
     * @summary Creates an order.
     * @request POST:/api/v1/orders
     * @secure
     */
    postOrder: (
      data: {
        /** @example "any" */
        productId?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostOrderResponse, any>({
        path: `/api/v1/orders`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of orders of the authenticated user.
     *
     * @tags Order
     * @name ListOrders
     * @summary Gets the orders.
     * @request GET:/api/v1/orders
     * @secure
     */
    listOrders: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
        /** The status of the order. */
        status?: string;
        /** Filter for showing all, only the customers or only the sellers orders. */
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOrdersResponse, any>({
        path: `/api/v1/orders`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The order will be captured by a given ID. If the order cannot be found, an exception will be thrown.
     *
     * @tags Order
     * @name CaptureOrder
     * @summary Captures an order by paypal order ID.
     * @request POST:/api/v1/orders/{paypalOrderId}/capture
     * @secure
     */
    captureOrder: (paypalOrderId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/orders/${paypalOrderId}/capture`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description The order will be queried by a given ID. If the order cannot be found, an exception will be thrown.
     *
     * @tags Order
     * @name GetOrderById
     * @summary Gets an order by ID.
     * @request GET:/api/v1/orders/{orderId}
     * @secure
     */
    getOrderById: (orderId: string, params: RequestParams = {}) =>
      this.request<GetOrderResponse, NotFoundResponse>({
        path: `/api/v1/orders/${orderId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The orders will be queried by a given product ID and the authenticated user ID.
     *
     * @tags Order
     * @name ListOrdersByProductId
     * @summary Gets orders by a product ID and the authenticated user ID.
     * @request GET:/api/v1/orders/products/{productId}
     * @secure
     */
    listOrdersByProductId: (
      productId: string,
      query?: {
        /** The status of the order. */
        status?: string;
        /** Filter for showing all, only the customers or only the sellers orders. */
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOrdersResponse, any>({
        path: `/api/v1/orders/products/${productId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The pattern will be queried by a given ID. If the pattern cannot be found, an exception will be thrown.
     *
     * @tags Pattern
     * @name GetPatternById
     * @summary Gets a pattern by ID.
     * @request GET:/api/v1/patterns/{patternId}
     * @secure
     */
    getPatternById: (patternId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/patterns/${patternId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description The patterns will be queried by a given product ID and optionally a language code. If the result length is greater than one, the results will be piped to a ZIP file.
     *
     * @tags Pattern
     * @name ListPatternsByProductId
     * @summary Lists patterns by a product ID.
     * @request GET:/api/v1/patterns/products/{productId}
     * @secure
     */
    listPatternsByProductId: (
      productId: string,
      query?: {
        /** The language of the pattern. */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/patterns/products/${productId}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name ApproveOrderWebhook
     * @summary Posts a "approve order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/approve
     * @secure
     */
    approveOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/approve`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name DeclineOrderWebhook
     * @summary Posts a "decline order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/decline
     * @secure
     */
    declineOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/decline`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name VoidOrderWebhook
     * @summary Posts a "void order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/void
     * @secure
     */
    voidOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/void`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name ExpireOrderWebhook
     * @summary Posts a "expire order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/expire
     * @secure
     */
    expireOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/expire`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name FailOrderWebhook
     * @summary Posts a "fail order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/fail
     * @secure
     */
    failOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/fail`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name PartiallyRefundOrderWebhook
     * @summary Posts a "partially refund order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/partially-refund
     * @secure
     */
    partiallyRefundOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/partially-refund`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name RefundOrderWebhook
     * @summary Posts a "refund order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/refund
     * @secure
     */
    refundOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/refund`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name ReverseOrderWebhook
     * @summary Posts a "reverse order" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/reverse
     * @secure
     */
    reverseOrderWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/reverse`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The authenticated user will be assigned to the "Pro" role. If the user already is assigned to the "Pro" role, an exception will be thrown. If the subscription is not active on PayPal, an exception will be thrown.
     *
     * @tags Subscription
     * @name PostSubscription
     * @summary Creates a subscription.
     * @request POST:/api/v1/subscriptions
     * @secure
     */
    postSubscription: (
      data: {
        /** @example "any" */
        paypalSubscriptionId?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/subscriptions`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
