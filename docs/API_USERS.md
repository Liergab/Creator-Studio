# User API Endpoint Documentation

## Base URL
```
/api/users
```

---

## GET /api/users

List users with **pagination**, **filters**, and **sort**. For super admin.

### Query parameters

| Param      | Type   | Default    | Description                                        |
|------------|--------|------------|----------------------------------------------------|
| `page`     | number | `1`        | Page number (1-based).                             |
| `limit`    | number | `10`       | Items per page (max `100`).                        |
| `role`     | string | —          | Filter by role: `super_admin`, `admin`, `user`.    |
| `search`   | string | —          | Search in `name` and `email` (alias: `q`).         |
| `sortBy`   | string | `createdAt`| Sort field: `createdAt`, `updatedAt`, `name`, `email`, `memberSince`, `role`. |
| `sortOrder`| string | `desc`     | `asc` or `desc`.                                   |

### Request
```http
GET /api/users
GET /api/users?page=2&limit=20
GET /api/users?role=admin&search=john
GET /api/users?page=1&limit=10&sortBy=name&sortOrder=asc
```

### Response (200 OK)
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      "memberSince": "2025-01-27T00:00:00.000Z",
      "createdAt": "2025-01-27T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Example: JavaScript/TypeScript (fetch)
```typescript
// Basic
const res = await fetch('/api/users');
const data = await res.json();
console.log(data.users, data.pagination);

// With pagination and filters
const params = new URLSearchParams({
  page: '2',
  limit: '20',
  role: 'admin',
  search: 'john',
  sortBy: 'name',
  sortOrder: 'asc',
});
const res2 = await fetch(`/api/users?${params}`);
const data2 = await res2.json();
```

### Example: cURL
```bash
curl "http://localhost:3000/api/users"
curl "http://localhost:3000/api/users?page=2&limit=20&role=user&search=john"
```

### Example: React Component
```tsx
"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "user";
  avatar?: string;
  memberSince: Date;
  createdAt: Date;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## POST /api/users

Create a new user.

### Request
```http
POST /api/users
Content-Type: application/json
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "role": "user",           // Optional: "super_admin" | "admin" | "user" (default: "user")
  "avatar": "https://..."   // Optional: avatar URL
}
```

**Required fields:**
- `email` (string)
- `name` (string)

**Optional fields:**
- `role` (string): `"super_admin"` | `"admin"` | `"user"` (default: `"user"`)
- `avatar` (string): URL to avatar image

### Response (201 Created)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "user",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    "memberSince": "2025-01-27T00:00:00.000Z",
    "createdAt": "2025-01-27T00:00:00.000Z",
    "updatedAt": "2025-01-27T00:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request** (missing required fields):
```json
{
  "error": "Email and name are required"
}
```

**409 Conflict** (email already exists):
```json
{
  "error": "User with this email already exists"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to create user"
}
```

### Example: JavaScript/TypeScript (fetch)
```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    name: 'Jane Doe',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  }),
});

if (response.ok) {
  const data = await response.json();
  console.log('Created user:', data.user);
} else {
  const error = await response.json();
  console.error('Error:', error.error);
}
```

### Example: cURL
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "user"
  }'
```

### Example: React Component (Create User Form)
```tsx
"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "admin" | "super_admin">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setSuccess(true);
      setEmail("");
      setName("");
      setRole("user");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>User created!</div>}
    </form>
  );
}
```

---

## DELETE /api/users/:id

Delete a user by id.

### Request

```http
DELETE /api/users/507f1f77bcf86cd799439011
```

### Response (200 OK)

```json
{
  "deleted": true,
  "id": "507f1f77bcf86cd799439011"
}
```

### Error Responses

**400 Bad Request** (missing/invalid id):

```json
{
  "error": "Invalid user id"
}
```

**404 Not Found** (user doesn’t exist):

```json
{
  "error": "User not found"
}
```

**500 Internal Server Error**:

```json
{
  "error": "Failed to delete user"
}
```

### Example: JavaScript/TypeScript (fetch)

```typescript
const userId = "507f1f77bcf86cd799439011";
const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
const data = await res.json();
if (!res.ok) throw new Error(data.error || "Failed to delete user");
```

### Example: cURL

```bash
curl -X DELETE "http://localhost:3000/api/users/507f1f77bcf86cd799439011"
```

## Using in Server Components (Next.js App Router)

```tsx
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Notes

- **Authentication**: Currently, these endpoints are **not protected**. Add authentication middleware if needed.
- **Role validation**: The `role` field accepts `"super_admin"`, `"admin"`, or `"user"`.
- **Email uniqueness**: Emails must be unique. Attempting to create a duplicate email returns a 409 Conflict.
- **Database**: Uses MongoDB via Prisma. User data is stored in the `users` collection.
