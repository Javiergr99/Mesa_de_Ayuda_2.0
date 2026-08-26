export type ApiCatalogReference = {
  id?: number;
  clave?: string | null;
  nombre?: string | null;
  siglas?: string | null;
};

export type BitacoraApiRecord = {
  id: string;
  nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  fecha?: string | null;
  hora?: string | null;
  instancia?: string | null;
  correo?: string | null;
  telefono?: string | null;
  observaciones?: string | null;
  atendido_por?: string | null;
  entidad_federativa_id?: number | null;
  tipo_caso_id?: number | null;
  estatus_id?: number | null;
  tipo_registro_id?: number | null;
  creado_por?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_deleted?: boolean;

  // Relaciones opcionales: algunos esquemas pueden serializarlas junto al FK.
  entidad_federativa?: ApiCatalogReference | null;
  tipo_caso?: ApiCatalogReference | null;
  estatus?: ApiCatalogReference | null;
  tipo_registro?: ApiCatalogReference | null;
};

export type BitacoraListResponse = {
  items: BitacoraApiRecord[];
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
};

export type BitacoraListParams = {
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  atendido_por?: string;
  creado_por?: string;
  entidad_federativa_id?: number;
  estatus_id?: number;
  tipo_caso_id?: number;
  tipo_registro_id?: number;
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  pagina?: number;
  limite?: number;
};

export type BitacoraCreatePayload = {
  nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  fecha?: string | null;
  hora?: string | null;
  instancia?: string | null;
  correo?: string | null;
  telefono?: string | null;
  observaciones?: string | null;
  atendido_por?: string | null;
  entidad_federativa_id?: number | null;
  tipo_caso_id?: number | null;
  estatus_id?: number | null;
  tipo_registro_id?: number | null;
};

export type BitacoraUpdatePayload = Partial<BitacoraCreatePayload>;

export type BitacoraArchivoApi = {
  id?: string | null;
  archivo_id?: string | null;
  nombre_original?: string | null;
  nombre?: string | null;
  extension?: string | null;
  tipo_mime?: string | null;
  tamanio_bytes?: number | null;
  tamano_bytes?: number | null;
  size?: number | null;
  created_at?: string | null;
  fecha_creacion?: string | null;
  es_correo_msg?: boolean;
  is_deleted?: boolean;
};
