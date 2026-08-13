import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router";

import { PageHeading } from "@/components/ui/page-heading";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AdministrativeAccessSummary } from "@/features/profile/components/administrative-access-summary";
import { InformationAlert } from "@/features/profile/components/information-alert";
import { ProfileStatusBadge } from "@/features/profile/components/profile-status-badge";
import { ProfileSummaryCard } from "@/features/profile/components/profile-summary-card";
import { ReadOnlyDataCard } from "@/features/profile/components/read-only-data-card";
import { ReadOnlyDataItem } from "@/features/profile/components/read-only-data-item";
import { SecurityStatusItem } from "@/features/profile/components/security-status-item";
import {
  formatProfileDate,
  getAccountStatusView,
  getAdministrativeAccessLabels,
  getAdministrativeRole,
  getFederalEntityName,
} from "@/features/profile/model/profile.utils";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const accountStatus = getAccountStatusView(user);
  const administrativeRole = getAdministrativeRole(user);
  const administrativePermissions = getAdministrativeAccessLabels(user);
  const entityName = getFederalEntityName(user.entidad_federativa_id);
  const hasFailedAttempts = user.intentos_login > 0;
  const emailVerified = Boolean(user.fecha_correo_verificado);

  return (
    <div className="app-page mx-auto w-full max-w-[1040px]">
      <PageHeading
        eyebrow={
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5">
            <Link to="/app/dashboard" className="hover:text-[var(--ui-primary)]">
              Inicio
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-[var(--ui-primary)]">Mi perfil</span>
          </nav>
        }
        title="Mi perfil"
        description="Consulta tu información personal, institucional y los privilegios administrativos asignados a tu cuenta."
      />

      <ProfileSummaryCard user={user} />

      <ReadOnlyDataCard title="Datos generales" icon={UserRound}>
        <dl className="profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
          <ReadOnlyDataItem label="Nombre" value={user.nombre} />
          <ReadOnlyDataItem label="Primer apellido" value={user.primer_apellido} />
          <ReadOnlyDataItem
            label="Segundo apellido"
            value={user.segundo_apellido || "No registrado"}
          />
          <ReadOnlyDataItem label="CURP" value={user.curp} />
          <ReadOnlyDataItem label="Correo electrónico" value={user.correo_electronico} />
          <ReadOnlyDataItem
            label="Número de teléfono"
            value={user.numero_telefono || "No registrado"}
          />
          <ReadOnlyDataItem
            label="Entidad federativa"
            value={entityName}
            className="sm:col-span-2 lg:col-span-3"
          />
        </dl>
      </ReadOnlyDataCard>

      <ReadOnlyDataCard title="Información institucional" icon={Building2}>
        <dl className="profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
          <ReadOnlyDataItem
            label="Institución"
            value={user.instancia?.nombre || "No registrada"}
          />
          <ReadOnlyDataItem
            label="Siglas de la institución"
            value={user.instancia?.siglas || "No registradas"}
          />
          <ReadOnlyDataItem label="Entidad federativa" value={entityName} />
          <ReadOnlyDataItem
            label="Estatus de la cuenta"
            value={
              <ProfileStatusBadge
                label={accountStatus.label}
                tone={accountStatus.tone}
                compact
              />
            }
          />
          <ReadOnlyDataItem label="Identificador del usuario" value={user.id} />
          <ReadOnlyDataItem
            label="Fecha de registro"
            value={formatProfileDate(user.fecha_creacion)}
          />
          <ReadOnlyDataItem
            label="Fecha de última actualización"
            value={formatProfileDate(user.fecha_actualizacion)}
            className="sm:col-span-2 lg:col-span-3"
          />
        </dl>
      </ReadOnlyDataCard>

      <ReadOnlyDataCard title="Seguridad de la cuenta" icon={ShieldCheck}>
        <div className="profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
          <SecurityStatusItem label="Autenticación de dos factores">
            <ProfileStatusBadge
              label={user.is_2fa_enabled ? "2FA activado" : "2FA no configurado"}
              tone={user.is_2fa_enabled ? "success" : "warning"}
              compact
            />
          </SecurityStatusItem>
          <SecurityStatusItem label="Estado de la cuenta">
            <ProfileStatusBadge
              label={accountStatus.label}
              tone={accountStatus.tone}
              compact
            />
          </SecurityStatusItem>
          <SecurityStatusItem label="Intentos de inicio de sesión">
            <ProfileStatusBadge
              label={
                hasFailedAttempts
                  ? `${user.intentos_login} intento(s) fallido(s)`
                  : "Sin intentos fallidos"
              }
              tone={hasFailedAttempts ? "warning" : "success"}
              compact
            />
          </SecurityStatusItem>
          <SecurityStatusItem label="Estado del correo electrónico">
            <ProfileStatusBadge
              label={emailVerified ? "Correo verificado" : "Verificación no registrada"}
              tone={emailVerified ? "success" : "neutral"}
              compact
            />
          </SecurityStatusItem>
          <SecurityStatusItem label="Fecha de verificación del correo">
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {formatProfileDate(user.fecha_correo_verificado)}
            </span>
          </SecurityStatusItem>
          <SecurityStatusItem label="Última actualización de la cuenta">
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {formatProfileDate(user.fecha_actualizacion)}
            </span>
          </SecurityStatusItem>
        </div>
      </ReadOnlyDataCard>

      {administrativeRole && administrativePermissions.length > 0 ? (
        <AdministrativeAccessSummary
          role={administrativeRole}
          permissions={administrativePermissions}
        />
      ) : null}

      <InformationAlert isAdministrator={Boolean(administrativeRole)} />
    </div>
  );
}
