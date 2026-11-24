export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  userStatus: 'ACTIVE' | 'LOCKED';
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: RegisterResponse;
}
