export type DashboardFilterParams = {
  atendido_por?: string;
  creado_por?: string;
  entidad_federativa_id?: number;
  estatus_id?: number;
  tipo_caso_id?: number;
  tipo_registro_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
};

export type DashboardRankItem = {
  id?: number | string | null;
  clave?: string | null;
  nombre?: string | null;
  total?: number | null;
  porcentaje?: number | null;
};

export type DashboardSummaryResponse = {
  total_atenciones: number;
  pendientes: number;
  en_proceso: number;
  atendidas: number;
  canceladas: number;
  porcentaje_finalizacion: number;
  promedio_atenciones_por_dia: number;
  registro_mas_activo?: DashboardRankItem | string | null;
  tipo_caso_mas_frecuente?: DashboardRankItem | string | null;
  estado_mas_activo?: DashboardRankItem | string | null;
  actividad_institucional_pfpnna?: DashboardRankItem | number | null;
};

export type DashboardTemporalPoint = {
  periodo: string;
  total: number;
};

export type DashboardEntityItem = {
  entidad_federativa_id?: number | null;
  entidad?: string | null;
  nombre?: string | null;
  clave?: string | null;
  total: number;
  porcentaje?: number | null;
};

export type DashboardByEntityResponse = {
  items?: DashboardEntityItem[];
  entidades?: DashboardEntityItem[];
  sin_entidad?: number;
  estado_mas_activo?: DashboardRankItem | string | null;
  actividad_institucional_pfpnna?: DashboardRankItem | number | null;
};
