import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Status, StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, TableSearch, Td } from "@/components/console/data-table";
import { RowAction } from "@/components/console/row-action";
import { api, getCurrentUser } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { EmployeePage } from "@/lib/types";

export const metadata: Metadata = { title: "Team" };

const BASE = "/dashboard/team";

export default async function TeamPage({ searchParams }: PageProps<"/dashboard/team">) {
  const f = readListParams(await searchParams);
  const [me, data] = await Promise.all([
    getCurrentUser(),
    api<EmployeePage>("/employees", { query: { keywords: f.q, limit: PAGE_SIZE, offset: f.offset }, returnTo: BASE }),
  ]);
  const isAdmin = me?.role === "admin";
  const current = { q: f.q, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Company" title="Team" description="Admins and agents who can manage your properties. Agents handle the viewings assigned to them." />

      <div className="flex justify-end">
        <TableSearch base={BASE} value={f.q} placeholder="Search name, email or phone" />
      </div>

      <div className="grid gap-4">
        <Table head={["Member", "Phone", "Role", "Status", "Joined", ""]} empty={!data.employees.length && <TableEmpty>No team members found.</TableEmpty>}>
          {data.employees.map((e) => {
            const u = e.user;
            const self = u?.id === me?.id;
            return (
              <tr key={e.id}>
                <Td>
                  <span className="flex items-center gap-3">
                    <UserAvatar name={u?.name ?? "?"} src={u?.profile_image} className="size-9 text-xs" />
                    <span className="min-w-0">
                      <span className="block font-medium">
                        {u?.name}
                        {self && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{u?.email}</span>
                    </span>
                  </span>
                </Td>
                <Td className="tabular">{u?.phone_number}</Td>
                <Td>
                  <StatusBadge tone={u?.role === "admin" ? "primary" : "info"}>{u?.role === "admin" ? "Admin" : "Agent"}</StatusBadge>
                </Td>
                <Td>
                  <Status value={e.status ?? "active"} />
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{e.joined_at ? formatDate(e.joined_at) : "—"}</Td>
                <Td>
                  {isAdmin && !self && u && (
                    <div className="flex justify-end gap-2">
                      <RowAction
                        path={`/employees/${e.id}`}
                        method="PUT"
                        body={{ role: u.role, status: e.status === "inactive" ? "active" : "inactive" }}
                        label={e.status === "inactive" ? "Activate" : "Deactivate"}
                        success={e.status === "inactive" ? "Member activated" : "Member deactivated"}
                        variant="ghost"
                      />
                      <RowAction
                        path={`/employees/${e.id}`}
                        method="DELETE"
                        label="Remove"
                        success="Member removed"
                        variant="ghost"
                        confirm={{ title: `Remove ${u.name}?`, description: "Their login is deleted and they lose access to your company.", action: "Remove member" }}
                      />
                    </div>
                  )}
                </Td>
              </tr>
            );
          })}
        </Table>
        <TableFooter total={data.totalItems} page={f.page} totalPages={data.totalPages} href={(page) => hrefWith(BASE, current, { page })} />
      </div>
    </div>
  );
}
