// API utility functions for interacting with the backend
const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Types based on the OpenAPI specification
export interface SignupRequest {
  role: "USER" | "VENDOR";
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  message: string;
}

export interface Vendor {
  id: number;
  businessName: string | null;
  location: string | null;
  bio: string | null;
  websiteUrl: string | null;
  profilePictureUrl: string | null;
  email: string;
  phoneNumber: string | null;
  addressId: string | null;
  priceEnum: "INEXPENSIVE" | "AFFORDABLE" | "MODERATE" | "LUXURY";
  approved: boolean;
  published: boolean;
}

export interface Profile {
  username: string;
  email: string;
  phone: number | null;
  role: "VENDOR" | "USER";
  vendor: Vendor | null;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public fieldErrors?: Record<string, string>,
    public path?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: ErrorResponse): ApiError {
    return new ApiError(
      response.status,
      response.error,
      undefined,
      response.fieldErrors,
      response.path,
    );
  }
}

// Token management
export class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USERNAME_KEY = "username";
  private static readonly USER_DATA_KEY = "user_data";

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
    }
  }

  static setUsername(username: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USERNAME_KEY, username);
    }
  }

  static getUsername(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.USERNAME_KEY);
    }
    return null;
  }

  static setUserData(userData: Profile): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  static getUserData(): Profile | null {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(this.USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

// Enhanced API call function with retry logic and better error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
  retries = 1,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`API Call: ${options.method || "GET"} ${url}`, {
        attempt: attempt + 1,
      });

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        let errorResponse: ErrorResponse;

        try {
          errorResponse = (await response.json()) as ErrorResponse;
        } catch {
          // If response is not JSON, create a fallback error response
          errorResponse = {
            timestamp: new Date().toISOString(),
            status: response.status,
            error: response.statusText || "Unknown error",
            path: endpoint,
          };
        }

        console.error("API Error:", errorResponse);
        throw ApiError.fromResponse(errorResponse);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(`API Success: ${options.method || "GET"} ${url}`, data);
        return data;
      } else {
        console.log(
          `API Success: ${options.method || "GET"} ${url} (empty response)`,
        );
        return {} as T;
      }
    } catch (error) {
      console.error(`API Error on attempt ${attempt + 1}:`, error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (attempt === retries) {
        throw new ApiError(
          0,
          error instanceof Error ? error.message : "Network error occurred",
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new ApiError(0, "Maximum retries exceeded");
}

// Auth API functions
export const authApi = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token and username after successful signup
    TokenManager.setToken(response.token);
    TokenManager.setUsername(response.username);

    return response;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token and username after successful login
    TokenManager.setToken(response.token);
    TokenManager.setUsername(response.username);

    return response;
  },

  async getProfile(token?: string): Promise<Profile> {
    const authToken = token || TokenManager.getToken();
    if (!authToken) {
      throw new ApiError(401, "No authentication token found");
    }

    const profile = await apiCall<Profile>(
      "/auth/profile",
      {
        method: "GET",
      },
      authToken,
    );

    // Store user data for quick access
    TokenManager.setUserData(profile);

    return profile;
  },

  async logout(): Promise<void> {
    TokenManager.removeToken();
  },

  isAuthenticated(): boolean {
    return TokenManager.getToken() !== null;
  },

  getCurrentUser(): Profile | null {
    return TokenManager.getUserData();
  },
};

// Vendor API functions
export const vendorApi = {
  async getAllVendors(): Promise<Vendor[]> {
    return apiCall<Vendor[]>("/vendors");
  },

  async getVendorById(id: number): Promise<Vendor> {
    return apiCall<Vendor>(`/vendors/${id}`);
  },

  async getVendorByEmail(email: string): Promise<Vendor> {
    return apiCall<Vendor>(`/vendors/email/${encodeURIComponent(email)}`);
  },

  async updateVendor(
    id: number,
    data: Vendor,
    token?: string,
  ): Promise<Vendor> {
    const authToken = token || TokenManager.getToken();
    if (!authToken) {
      throw new ApiError(401, "No authentication token found");
    }

    return apiCall<Vendor>(
      `/vendors/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      authToken,
    );
  },

  async createVendor(
    data: Omit<Vendor, "id">,
    token?: string,
  ): Promise<Vendor> {
    const authToken = token || TokenManager.getToken();
    if (!authToken) {
      throw new ApiError(401, "No authentication token found");
    }

    // Since there's no POST endpoint for vendors in the API spec,
    // we'll use PUT with id 0 or create a vendor through profile update
    const vendorData: Vendor = {
      id: 0,
      ...data,
    };

    return this.updateVendor(0, vendorData, authToken);
  },
};
