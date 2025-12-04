export interface Usuario {
  idUsuario: number;
  email: string;
  password?: string;
}

export interface Participante extends Usuario {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface Administrador extends Usuario {
  idAdmin?: number;
}

export interface Torneo {
  idTorneo: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  publicado: boolean;
}

export interface Competencia {
  idCompetencia: number;
  nombre: string;
  precioBase: number;
  cupo: number;
  torneoId?: number;
}

export interface Inscripcion {
  idInscripcion: number;
  fechaInscripcion: string;
  precioPagado: number;
  nombreTorneo: string;
  nombreCompetencia: string;
}

export interface AuthResponse {
  token: string;
}

export interface CreateParticipantRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface CreateTournamentRequest {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface CreateCompetitionRequest {
  name: string;
  cupo: number;
  precioBase: number;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'participant' | null;
