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

export interface CancelSubscriptionRequest {
  paypalSubscriptionId: string;
}

export interface PostUserReportRequest {
  reason: string;
  comment?: string;
}

export interface GetUserReportResponse {
  reason: string;
  reporterComment?: string;
  defendantComment?: string;
  adminComment?: string;
  status: string;
  reporter: GetUserAccountResponse;
  defendant: GetUserAccountResponse;
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

export interface ListUserReportsResponse {
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
  userReports: GetUserReportResponse[];
}

export interface GetUserMetricsResponse {
  profileViews: number;
}

export interface PostUserPayPalReferralRequest {
  hasPayPalBusinessAccount: boolean;
  shareDataToPayPalGranted: boolean;
  paypalEmail: string;
}

export interface PostUserPayPalReferralResponse {
  actionUrl: string;
}

export interface VerifyCodeRequest {
  verificationCode: string;
}

export interface VerifyCodeResponse {
  successMessage: string;
}

export interface ResendCodeRequest {
  mailType: string;
}

export interface ResendCodeResponse {
  successMessage: string;
}

export interface RequestPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  verificationCode: string;
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
  hasAcceptedPrivacy: boolean;
  hasAcceptedTerms: boolean;
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
  hasAcceptedPrivacy?: boolean;
  hasAcceptedTerms?: boolean;
  roles?: string[];
}

export interface PutUserPasswordRequest {
  password?: string;
  oldPassword?: string;
}

export interface PutGalleryImagesRequest {
  galleryImages: string[];
}

export interface GetUserPayPalMerchantStatusResponse {
  paypalPaymentsReceivable: boolean;
  paypalLegalName: string;
  paypalPrimaryEmail: string;
  paypalPrimaryEmailConfirmed: boolean;
  hasOauthThirdParty: boolean;
}

export interface GetUserResponse {
  id: string;
  email: string;
  username: string;
  description?: string;
  galleryImages: string[];
  isActive: boolean;
  isBlocked: boolean;
  isMailConfirmed: boolean;
  hasAcceptedPrivacy: boolean;
  hasAcceptedTerms: boolean;
  openIncidentsCount: number;
  isSponsored: boolean;
  firstName?: string;
  lastName?: string;
  instagramRef?: string;
  tiktokRef?: string;
  paypalMerchantIsActive: boolean;
  paypalPaymentsReceivable: boolean;
  paypalPrimaryEmailConfirmed: boolean;
  paypalSubscriptionId?: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  paypalSubscriptionValidUntil?: string;
  paypalSubscriptionStatus: string;
  imageUrl?: string;
  roles?: string[];
  keycloakUserId?: string;
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
  isBlocked: boolean;
  paypalMerchantIsActive: boolean;
  paypalSubscriptionStatus: string;
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

export interface PostProductReportRequest {
  reason: string;
  comment?: string;
}

export interface GetProductReportsCountResponse {
  openIncidentsCount: number;
}

export interface GetProductReportResponse {
  reason: string;
  reporterComment?: string;
  defendantComment?: string;
  adminComment?: string;
  status: string;
  reporter: GetUserAccountResponse;
  defendant: GetUserAccountResponse;
  product: GetProductResponse;
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

export interface ListProductReportsResponse {
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
  productReports: GetProductReportResponse[];
}

export interface GetProductMetricsResponse {
  productViews: number;
  productImpressions: number;
}

export interface PostProductResponse {
  productId: string;
}

export interface PutProductRequest {
  imageUrls: any[];
  hashtags: any[];
  subCategories: any[];
  fileOrder: {
    language?: string;
    fileId?: string;
  }[];
  title: string;
  description: string;
  category: string;
  price: number;
  isFree: boolean;
  experience: string;
}

export interface GetProductResponse {
  id: string;
  imageUrls: string[];
  fileOrder: {
    fileId: string;
    language: string;
  }[];
  subCategories: string[];
  hashtags: string[];
  files: {
    id: string;
    objectName: string;
    language: string;
    fieldName: string;
  }[];
  title: string;
  description: string;
  category: string;
  price: number;
  isFree: boolean;
  experience: string;
  isSponsored: boolean;
  hasPayPalBusinessAccount: boolean;
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

export interface DeleteUsersFromTestingRequest {
  testerIds: string[];
}

export interface GetTestingMetricsResponse {
  testingViews: number;
  testingImpressions: number;
}

export interface PostTestingRequest {
  testerIds: string[];
  productId: string;
  durationInWeeks: number;
}

export interface PostTestingResponse {
  testingId: string;
}

export interface PutTestingRequest {
  testerIds?: any[];
  /** @example "neutral" */
  theme?: string;
  durationInWeeks?: number;
}

export interface GetTestingResponse {
  id: string;
  testerIds?: string[];
  testers?: GetUserAccountResponse[];
  /** @example "neutral" */
  theme: string;
  durationInWeeks: number;
  /** @format date-time */
  dueDate?: string;
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
  testerStatus?: string;
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
  actions: {
    id: string;
    description: string;
    variant: string;
    payload?: string;
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
  status: string;
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

export interface PostCaptureOrderResponse {
  orderId: string;
}

export interface PostOrderRequest {
  productId: string;
  customPrice?: number;
}

export interface PostOrderResponse {
  orderId: string;
  paypalOrderId: string;
  captureLink: string;
}

export interface GetOrderAnalyticsResponse {
  totalSales: number;
  totalRevenue: number;
  averageSaleRevenue: number;
  completionRate: string;
  totalRevenuePerMonth: {
    /** @example "03.2024" */
    month: string;
    revenue: number;
  }[];
  totalSalesOfCurrentMonth: number;
  lastSales: {
    userId: string;
    fullName?: string;
    imageUrl?: string;
    username: string;
    revenue: number;
  }[];
  feesComparisonPerMonth: {
    /** @example "03.2024" */
    month: string;
    totalPayPalFee: number;
    totalPlatformFee: number;
  }[];
  orderStatusDistribution: {
    /** @example "PENDING" */
    status: string;
    count: number;
  }[];
}

export interface GetOrderResponse {
  id: string;
  files: {
    id: string;
    objectName: string;
    language: string;
    fieldName: string;
  }[];
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
  isCustomPrice: boolean;
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

export interface GetFileResponse {
  id: string;
  objectName: string;
  fieldName: string;
  language: string;
}

export interface ListFilesResponse {
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
  orders: GetFileResponse[];
}

export interface DownloadPatternResponse {
  objectName: string;
}

export interface GetPatternResponse {
  orderId: string;
  productId: string;
  productTitle: string;
  productDescription: string;
  productImageUrls: string[];
  productFileOrder: {
    fileId: string;
    language: string;
  }[];
  patterns: any[];
  seller: GetUserAccountResponse;
}

export interface ListPatternsResponse {
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
  patterns: GetPatternResponse[];
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
  paypalDebugId?: string;
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

export interface PostNewsletterSubscriptionRequest {
  email: string;
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
  public baseUrl: string = 'http://0.0.0.0:3001/';
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
 * @title Pattern Paradise
 * @version 1.0.0
 * @baseUrl http://0.0.0.0:3001/
 *
 * The Pattern Paradise platform enables buyers, sellers and testers to get the most out of patterns.
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
        hasAcceptedTerms?: any;
        /** @example "any" */
        hasAcceptedPrivacy?: any;
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
        hasAcceptedTerms?: any;
        /** @example "any" */
        hasAcceptedPrivacy?: any;
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
        /** @example "any" */
        oldPassword?: any;
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
     * @description Creates a PayPal referral for the authenticated user by the given request body data and user ID.
     *
     * @tags User
     * @name PostUserPayPalReferral
     * @summary Creates a PayPal referral for the user.
     * @request POST:/api/v1/users/{userId}/paypal-referral
     * @secure
     */
    postUserPayPalReferral: (
      userId: string,
      data: {
        /** @example "any" */
        hasPayPalBusinessAccount?: any;
        /** @example "any" */
        shareDataToPayPalGranted?: any;
        /** @example "any" */
        paypalEmail?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostUserPayPalReferralResponse, any>({
        path: `/api/v1/users/${userId}/paypal-referral`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Removes a PayPal referral of the authenticated user by the given user ID.
     *
     * @tags User
     * @name DeleteUserPayPalReferral
     * @summary Removes the PayPal referral of the user.
     * @request DELETE:/api/v1/users/{userId}/paypal-referral
     * @secure
     */
    deleteUserPayPalReferral: (userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/users/${userId}/paypal-referral`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description The user will be queried by a given ID or username. If the user cannot be found, an exception will be thrown.
     *
     * @tags User
     * @name GetUserById
     * @summary Gets an user by ID or username.
     * @request GET:/api/v1/users/account/{userId}
     * @secure
     */
    getUserById: (
      userId: string,
      query?: {
        /** If metrics should be tracked. */
        trackMetrics?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetUserAccountResponse, NotFoundResponse>({
        path: `/api/v1/users/account/${userId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
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
     * @description The user will be queried by a given ID or username. If the user cannot be found or the user ID is not related to the authenticated user, an exception will be thrown.
     *
     * @tags User
     * @name GetPayPalMerchantStatus
     * @summary Gets the PayPal merchant status for the user.
     * @request GET:/api/v1/users/{userId}/paypal-merchant-status
     * @secure
     */
    getPayPalMerchantStatus: (userId: string, params: RequestParams = {}) =>
      this.request<GetUserPayPalMerchantStatusResponse, NotFoundResponse>({
        path: `/api/v1/users/${userId}/paypal-merchant-status`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Requests a password mail by the given request body data.
     *
     * @tags User
     * @name RequestPassword
     * @summary Requests a password mail.
     * @request POST:/api/v1/users/passwords/request-password
     * @secure
     */
    requestPassword: (
      data: {
        /** @example "any" */
        email?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/passwords/request-password`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates the user password by the given verification code and request body data.
     *
     * @tags User
     * @name ResetPassword
     * @summary Updates the users password by verification code.
     * @request PUT:/api/v1/users/passwords/reset-password
     * @secure
     */
    resetPassword: (
      data: {
        /** @example "any" */
        newPassword?: any;
        /** @example "any" */
        verificationCode?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/passwords/reset-password`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Confirms the users email by the given verification code and request body data.
     *
     * @tags User
     * @name ConfirmMail
     * @summary Confirms the mail of a user.
     * @request PUT:/api/v1/users/verification-codes/confirm-mail
     * @secure
     */
    confirmMail: (
      data: {
        /** @example "any" */
        verificationCode?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<VerifyCodeResponse, any>({
        path: `/api/v1/users/verification-codes/confirm-mail`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Resends the users code by the given request body data.
     *
     * @tags User
     * @name ResendCode
     * @summary Resends the code of a given mail type and a user.
     * @request PUT:/api/v1/users/verification-codes/resend-code
     * @secure
     */
    resendCode: (
      data: {
        /** @example "any" */
        mailType?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/users/verification-codes/resend-code`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Creates a product with files and metadata provided in the request body.
     *
     * @tags Product
     * @name PostProduct
     * @summary Creates a product.
     * @request POST:/api/v1/products
     * @secure
     */
    postProduct: (
      data: {
        /** Array of files to upload. */
        files: File[];
        /** Array of file names. */
        fileNames: {
          filename?: string;
          originalFilename?: string;
        }[];
        /** Array of product image URLs. */
        imageUrls: string[];
        /** Array of hashtags. */
        hashtags: string[];
        /** Array of sub categories. */
        subCategories: string[];
        /** Array of languages related to files. */
        languages: {
          language?: string;
          fileName?: string;
        }[];
        /** Array of files order. */
        fileOrder: {
          language?: string;
          fileId?: string;
        }[];
        /** The title of the product. */
        title: string;
        /** A description of the product. */
        description: string;
        /** The category of the product. */
        category: string;
        /** The price of the product. */
        price: number;
        /** Indicates if the product is free (true/false). */
        isFree: string;
        /** The experience level of the product. */
        experience: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostProductResponse, any>({
        path: `/api/v1/products`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
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
        /** How to sort the result. */
        sortBy?: string;
        /** List of categories to filter products. */
        categories?: string[];
        /** List of subcategories to filter products. */
        subCategories?: string[];
        /** List of hashtags to filter products. */
        hashtags?: string[];
        /** List of languages to filter products. */
        languages?: string[];
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
        hashtags?: any;
        /** @example "any" */
        fileOrder?: any;
        /** @example "any" */
        subCategories?: any;
        /** @example "any" */
        title?: any;
        /** @example "any" */
        description?: any;
        /** @example "any" */
        category?: any;
        /** @example "any" */
        experience?: any;
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
    getProductById: (
      productId: string,
      query?: {
        /** If metrics should be tracked. */
        trackMetrics?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetProductResponse, NotFoundResponse>({
        path: `/api/v1/products/${productId}`,
        method: 'GET',
        query: query,
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
     * @description Releases the product by the given product ID.
     *
     * @tags Product
     * @name ReleaseProduct
     * @summary Releases the product.
     * @request PUT:/api/v1/products/{productId}/release
     * @secure
     */
    releaseProduct: (productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/products/${productId}/release`,
        method: 'PUT',
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
        /** @example "any" */
        durationInWeeks?: any;
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
        /** List of status to filter testings. */
        status?: string[];
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
        /** @example "any" */
        durationInWeeks?: any;
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
        /** The status to filter by. */
        status?: string[];
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
        /** Filter for showing all, only the customers or only the sellers testings. */
        filter?: string;
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
    getTestingByProductId: (
      productId: string,
      query?: {
        /** If metrics should be tracked. */
        trackMetrics?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTestingResponse, any>({
        path: `/api/v1/testings/products/${productId}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query removes users from a testing by a given ID.
     *
     * @tags Testing
     * @name RemoveUsersFromTesting
     * @summary Removes users from testing.
     * @request DELETE:/api/v1/testings/{testingId}/users
     * @secure
     */
    removeUsersFromTesting: (
      testingId: string,
      data: {
        /** @example "any" */
        testerIds?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/testings/${testingId}/users`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
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
        /** @example "any" */
        testerStatus?: any;
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
     * @description The query returns a list of testing review comment of a given testing ID.
     *
     * @tags Testing comment
     * @name ListTestingReviewCommentsByTestingId
     * @summary Gets the testing review comments by testing ID.
     * @request GET:/api/v1/testing-comments/testings/{testingId}/reviews
     * @secure
     */
    listTestingReviewCommentsByTestingId: (
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
        path: `/api/v1/testing-comments/testings/${testingId}/reviews`,
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
        /** @example "any" */
        customPrice?: any;
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
      this.request<PostCaptureOrderResponse, NotFoundResponse>({
        path: `/api/v1/orders/${paypalOrderId}/capture`,
        method: 'POST',
        secure: true,
        format: 'json',
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
     * @description The order will be queried by a given ID. If the order cannot be found, an exception will be thrown.
     *
     * @tags Order
     * @name DeleteOrder
     * @summary Deletes an order by ID.
     * @request DELETE:/api/v1/orders/{orderId}
     * @secure
     */
    deleteOrder: (orderId: string, params: RequestParams = {}) =>
      this.request<void, NotFoundResponse>({
        path: `/api/v1/orders/${orderId}`,
        method: 'DELETE',
        secure: true,
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
     * @description The query returns a set of analytics for the orders of the authenticated seller user.
     *
     * @tags Order
     * @name GetOrderAnalytics
     * @summary Gets the analytics for all orders of seller.
     * @request GET:/api/v1/orders/{userId}/analytics
     * @secure
     */
    getOrderAnalytics: (
      userId: string,
      query?: {
        /** The start date. */
        startDate?: string;
        /** The end date. */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetOrderAnalyticsResponse, any>({
        path: `/api/v1/orders/${userId}/analytics`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The patterns will be queried by a given product ID and optionally by language.
     *
     * @tags Pattern
     * @name DownloadPatterns
     * @summary Downloads patterns by product ID.
     * @request GET:/api/v1/patterns/products/{productId}/download
     * @secure
     */
    downloadPatterns: (
      productId: string,
      query: {
        /** The language of the pattern. */
        language: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/patterns/products/${productId}/download`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description The patterns will be queried by a given product ID and language and will be send to the specified channel.
     *
     * @tags Pattern
     * @name SendPatterns
     * @summary Sends patterns by product ID and language to a specified channel.
     * @request GET:/api/v1/patterns/products/{productId}/send
     * @secure
     */
    sendPatterns: (
      productId: string,
      query: {
        /** The language of the pattern. */
        language: string;
        /** The channel where patterns should be send to. */
        channel: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/patterns/products/${productId}/send`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description The pattern will be queried by a given ID. If the pattern cannot be found, an exception will be thrown.
     *
     * @tags Pattern
     * @name DownloadPattern
     * @summary Downloads a pattern by a given ID.
     * @request GET:/api/v1/patterns/{patternId}/download
     * @secure
     */
    downloadPattern: (patternId: string, params: RequestParams = {}) =>
      this.request<DownloadPatternResponse, NotFoundResponse>({
        path: `/api/v1/patterns/${patternId}/download`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The query returns a list of patterns of the authenticated user.
     *
     * @tags Pattern
     * @name ListPatterns
     * @summary Gets the patterns.
     * @request GET:/api/v1/patterns
     * @secure
     */
    listPatterns: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
        /** The query. */
        q?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListPatternsResponse, any>({
        path: `/api/v1/patterns`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The webhook will parse the event
     *
     * @tags Webhook
     * @name PaypalWebhook
     * @summary Handles all PayPal webhook events.
     * @request POST:/api/v1/webhooks/paypal
     * @secure
     */
    paypalWebhook: (
      data: {
        /** @example "any" */
        request?: any;
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal`,
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
     * @name CancelSubscriptionWebhook
     * @summary Posts a "cancel subscription" PayPal webhook event.
     * @request POST:/api/v1/webhooks/paypal/subscription/cancel
     * @secure
     */
    cancelSubscriptionWebhook: (
      data: {
        /** @example "any" */
        resource?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/webhooks/paypal/subscription/cancel`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The authenticated user will be assigned to the Pro role. If the user already is assigned to the "Pro" role, an exception will be thrown. If the subscription is not active on PayPal, an exception will be thrown.
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

    /**
     * @description PayPal will be informed about the cancelled subscription. If the subscription is not active on PayPal, an exception will be thrown.
     *
     * @tags Subscription
     * @name CancelSubscription
     * @summary Cancels a subscription.
     * @request POST:/api/v1/subscriptions/{subscriptionId}/cancel
     * @secure
     */
    cancelSubscription: (subscriptionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/subscriptions/${subscriptionId}/cancel`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description The metrics contain profile views.
     *
     * @tags Metrics
     * @name GetUserMetrics
     * @summary Gets the metrics of the authenticated user.
     * @request GET:/api/v1/metrics/users/{userId}
     * @secure
     */
    getUserMetrics: (userId: string, params: RequestParams = {}) =>
      this.request<GetUserMetricsResponse, any>({
        path: `/api/v1/metrics/users/${userId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The metrics contain product views and impressions.
     *
     * @tags Metrics
     * @name GetProductMetrics
     * @summary Gets the metrics of the product for the authenticated user.
     * @request GET:/api/v1/metrics/products/{productId}
     * @secure
     */
    getProductMetrics: (productId: string, params: RequestParams = {}) =>
      this.request<GetProductMetricsResponse, any>({
        path: `/api/v1/metrics/products/${productId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The metrics contain testing views and impressions.
     *
     * @tags Metrics
     * @name GetTestingMetrics
     * @summary Gets the metrics of the product for the authenticated user.
     * @request GET:/api/v1/metrics/testings/{productId}
     * @secure
     */
    getTestingMetrics: (productId: string, params: RequestParams = {}) =>
      this.request<GetTestingMetricsResponse, any>({
        path: `/api/v1/metrics/testings/${productId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The impression will be created based on the given product ID. If the product cannot be found, an exception will be thrown.
     *
     * @tags Metrics
     * @name PostProductImpression
     * @summary Creates a product impression.
     * @request POST:/api/v1/metrics/products/{productId}/impressions
     * @secure
     */
    postProductImpression: (productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/metrics/products/${productId}/impressions`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description The impression will be created based on the given testing ID. If the testing cannot be found, an exception will be thrown.
     *
     * @tags Metrics
     * @name PostTestingImpression
     * @summary Creates a testing impression.
     * @request POST:/api/v1/metrics/testings/products/{productId}/impressions
     * @secure
     */
    postTestingImpression: (productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/metrics/testings/products/${productId}/impressions`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description The reports can only be retrieved by the reporter, defendant or admin.
     *
     * @tags Reports
     * @name ListUserReports
     * @summary Lists user reports.
     * @request GET:/api/v1/reports/users
     * @secure
     */
    listUserReports: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
        /** The order direction. */
        direction?: string;
        /** The status of the report. */
        status?: string;
        /** The reason of the report. */
        reason?: string;
        /** The userId (reporter or defendant) of the report. */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListUserReportsResponse, any>({
        path: `/api/v1/reports/users`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The reports can only be retrieved by the reporter, defendant or admin.
     *
     * @tags Reports
     * @name ListProductReports
     * @summary Lists the reports for the given product.
     * @request GET:/api/v1/reports/products
     * @secure
     */
    listProductReports: (
      query?: {
        /** The current page number. */
        pageNumber?: number;
        /** The page size. */
        pageSize?: number;
        /** The order direction. */
        direction?: string;
        /** The status of the report. */
        status?: string;
        /** The reason of the report. */
        reason?: string;
        /** The user ID (reporter or defendant) of the report. */
        userId?: string;
        /** The product ID of the report. */
        productId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListProductReportsResponse, any>({
        path: `/api/v1/reports/products`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The total count is based on created or in progress reports on products of the authenticated user..
     *
     * @tags Reports
     * @name GetProductReportsCount
     * @summary Gets the total count of open reports for products of the authenticated user.
     * @request GET:/api/v1/reports/products/users/{userId}/count
     * @secure
     */
    getProductReportsCount: (userId: string, params: RequestParams = {}) =>
      this.request<GetProductReportsCountResponse, any>({
        path: `/api/v1/reports/products/users/${userId}/count`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description The report will be created based on the given user ID. If the user cannot be found, an exception will be thrown.
     *
     * @tags Reports
     * @name PostUserReport
     * @summary Creates a report for a user.
     * @request POST:/api/v1/reports/users/{userId}
     * @secure
     */
    postUserReport: (
      userId: string,
      data: {
        /** @example "any" */
        reason?: any;
        /** @example "any" */
        comment?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/reports/users/${userId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The report will be created based on the given product ID. If the product cannot be found, an exception will be thrown.
     *
     * @tags Reports
     * @name PostProductReport
     * @summary Creates a report for a product.
     * @request POST:/api/v1/reports/products/{productId}
     * @secure
     */
    postProductReport: (
      productId: string,
      data: {
        /** @example "any" */
        reason?: any;
        /** @example "any" */
        comment?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/reports/products/${productId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description The newsletter subscription will be created based on the given email. If the newsletter subscription for the given email already exists, an exception will be thrown.
     *
     * @tags Newsletter subscription
     * @name PostNewsletterSubscription
     * @summary Creates a newsletter subscription.
     * @request POST:/api/v1/newsletter-subscriptions
     * @secure
     */
    postNewsletterSubscription: (
      data: {
        /** @example "any" */
        email?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/newsletter-subscriptions`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
