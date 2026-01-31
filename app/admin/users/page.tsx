"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

type RoleFilter = "all" | "super_admin" | "admin" | "user";

interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "user";
  avatar?: string | null;
  memberSince: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (search) params.set("search", search);
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch users");

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch users");
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleRoleChange = (r: RoleFilter) => {
    setRoleFilter(r);
    setPage(1);
  };

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users, roles, and filters. Data from API with pagination.
          </p>
        </div>
        <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add user
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
        <div className="flex gap-2 flex-wrap">
          {(["all", "super_admin", "admin", "user"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === r
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border"
              }`}
            >
              {r === "all" ? "All" : r.replace("_", " ")}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/15 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-secondary rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading users…</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Joined</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-background/30">
                        <td className="py-3 px-4 font-medium text-foreground">{u.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                              u.role === "super_admin"
                                ? "bg-amber-500/20 text-amber-500"
                                : u.role === "admin"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {u.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(u.memberSince ?? u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasMore || loading}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
