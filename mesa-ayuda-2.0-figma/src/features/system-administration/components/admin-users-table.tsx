import { Eye, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminUserStatusBadge } from "@/features/system-administration/components/admin-user-status-badge";
import type { AdminUser } from "@/features/system-administration/model/admin-user.types";

export function AdminUsersTable({ users, onView, canView }: { users: AdminUser[]; onView: (id: string) => void; canView: boolean }) {
  if (!users.length) {
    return <Card><EmptyState icon={UsersRound} title="No se encontraron usuarios" description="Ajusta los filtros o registra una nueva cuenta para continuar." /></Card>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead className="bg-slate-100/80 text-xs font-bold text-[var(--ui-text-secondary)]">
            <tr>
              <th className="px-4 py-4">Usuario</th>
              <th className="px-4 py-4">CURP</th>
              <th className="px-4 py-4">Correo electrónico</th>
              <th className="px-4 py-4">Instancia</th>
              <th className="px-4 py-4">Grupos</th>
              <th className="px-4 py-4">Estatus</th>
              <th className="px-4 py-4">Entidad</th>
              <th className="px-4 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[var(--ui-border)] text-sm text-[var(--ui-text-primary)] hover:bg-slate-50/70">
                <td className="px-4 py-4"><p className="font-semibold">{user.fullName}</p><p className="mt-0.5 text-xs text-[var(--ui-text-secondary)]">ID: {user.username}</p></td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs">{user.curp}</td>
                <td className="max-w-[220px] truncate px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">{user.instance}</td>
                <td className="max-w-[220px] px-4 py-4">{user.groups.length ? user.groups.map((group) => group.name).join(", ") : "Sin grupos"}</td>
                <td className="px-4 py-4"><AdminUserStatusBadge status={user.status} /></td>
                <td className="px-4 py-4">{user.entity}</td>
                <td className="px-4 py-4 text-center">
                  <Button variant="secondary" size="icon" onClick={() => onView(user.id)} disabled={!canView} aria-label={`Ver detalle de ${user.fullName}`} title={canView ? "Ver detalle" : "No tienes VER_USUARIO_DETALLE"}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
