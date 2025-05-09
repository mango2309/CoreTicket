export interface Usuario {
    idUsuario?: number;
    cedula: string;
    email: string;
    passwordHash: string;
    paisId: number;
    provinciaId: number;
    ciudadId: number;
  }