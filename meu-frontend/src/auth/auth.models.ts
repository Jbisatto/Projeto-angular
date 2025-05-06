export interface AuthRequest {
    nome: string;
    senha: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
  }