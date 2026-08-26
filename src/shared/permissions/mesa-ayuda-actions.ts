export const MESA_AYUDA_ACTIONS = {
  viewLog: "VER_BITACORA",
  createLog: "CREAR_BITACORA",
  updateLog: "ACTUALIZAR_BITACORA",
  deleteLog: "ELIMINAR_BITACORA",
  uploadLogFile: "SUBIR_ARCHIVO_BITACORA",
  viewDashboard: "VER_DASHBOARD",
} as const;

export type MesaAyudaAction = (typeof MESA_AYUDA_ACTIONS)[keyof typeof MESA_AYUDA_ACTIONS];
