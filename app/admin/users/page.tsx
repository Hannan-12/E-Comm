import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() || undefined;

  const users = await prisma.user.findMany({
    where: {
      ...(search ? { OR: [
        { email: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
      ]} : {}),
    },
    include: { _count: { select: { orders: true } }, orders: { select: { totalAmount: true } } },
    orderBy: { registeredAt: "desc" },
  });

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <div className="t-label" style={{ marginBottom:".25rem" }}>Community</div>
          <h1 className="fw-800" style={{ fontSize:"1.7rem", letterSpacing:"-.03em", margin:0 }}>Users</h1>
          <p className="t-small" style={{ margin:0 }}>{users.length} registered</p>
        </div>
      </div>

      <form method="GET" style={{ display:"flex", gap:".5rem", marginBottom:"1.25rem" }}>
        <input type="text" name="search" defaultValue={search} placeholder="Search by name or email…" className="sort-select" style={{ minWidth:"260px" }} />
        <button type="submit" className="btn-ghost btn-sm">Search</button>
        {search && <Link href="/admin/users" className="btn-ghost btn-sm">✕ Clear</Link>}
      </form>

      <div className="panel">
        {users.length === 0 ? (
          <div style={{ textAlign:"center", padding:"2.5rem", fontSize:".8125rem", color:"var(--subtle)" }}>No users found.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th style={{ textAlign:"right" }}>Orders</th>
                  <th style={{ textAlign:"right" }}>Total Spent</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const totalSpent = u.orders.reduce((s, o) => s + Number(o.totalAmount), 0);
                  const initials = (u.fullName?.[0] ?? u.email[0]).toUpperCase();
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                          <div className="admin-user-avatar" style={{ width:"30px", height:"30px", fontSize:".7rem" }}>{initials}</div>
                          <div className="fw-600" style={{ color:"var(--ink)", fontSize:".875rem" }}>
                            {u.fullName || "—"}
                          </div>
                        </div>
                      </td>
                      <td className="t-small">{u.email}</td>
                      <td className="t-small">{formatDate(u.registeredAt)}</td>
                      <td style={{ textAlign:"right" }}>
                        {u._count.orders > 0
                          ? <Link href="/admin/orders" className="fw-700" style={{ color:"var(--brand)" }}>{u._count.orders}</Link>
                          : <span className="t-small">0</span>}
                      </td>
                      <td style={{ textAlign:"right" }}>
                        {totalSpent > 0
                          ? <span className="fw-700" style={{ color:"var(--brand)" }}>{formatPrice(totalSpent)}</span>
                          : <span className="t-small">—</span>}
                      </td>
                      <td>
                        <span className={`status-badge ${u.role === "ADMIN" ? "status-paid" : "status-delivered"}`}>
                          {u.role === "ADMIN" ? "Admin" : "Customer"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
