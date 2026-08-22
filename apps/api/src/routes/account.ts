import { Hono } from "hono";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ApiKey,
  CreateApiKeyPayload,
} from "@marble/types";

const app = new Hono();

// Mock in-memory database state
let currentProfile: UserProfile = {
  id: "usr_1",
  name: "John Doe",
  email: "john@example.com",
  company: "Marble Technologies",
  role: "Admin",
  phone: "+1 (555) 123-4567",
  timezone: "UTC-5",
  plan: "Pro",
  status: "Active",
  memberSince: "Jan 15, 2026",
};

let currentApiKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Production Key",
    key: "sk_prod_7f8a9b0c1d2e3f4a5b6c7d8e9f",
    created: "2026-01-15",
    lastUsed: "2 hours ago",
  },
  {
    id: "key_2",
    name: "Development Key",
    key: "sk_dev_1a2b3c4d5e6f7a8b9c0d1e2f3a",
    created: "2026-02-20",
    lastUsed: "1 hour ago",
  },
];

// GET /api/account/profile
app.get("/profile", (c) => {
  return c.json({ success: true, data: currentProfile });
});

// PUT /api/account/profile
app.put("/profile", async (c) => {
  const body: UpdateProfilePayload = await c.req.json();
  currentProfile = {
    ...currentProfile,
    ...body,
  };
  return c.json({ success: true, data: currentProfile });
});

// POST /api/account/password
app.post("/password", async (c) => {
  const body: ChangePasswordPayload = await c.req.json();
  if (!body.currentPassword || !body.newPassword) {
    return c.json(
      { success: false, error: "Current password and new password are required" },
      400
    );
  }
  return c.json({ success: true, message: "Password updated successfully" });
});

// GET /api/account/keys
app.get("/keys", (c) => {
  return c.json({ success: true, data: currentApiKeys });
});

// POST /api/account/keys
app.post("/keys", async (c) => {
  const body: CreateApiKeyPayload = await c.req.json();
  if (!body.name || !body.name.trim()) {
    return c.json({ success: false, error: "Key name is required" }, 400);
  }
  const randomHex = Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  const newKey: ApiKey = {
    id: `key_${Date.now()}`,
    name: body.name.trim(),
    key: `sk_live_${randomHex}`,
    created: new Date().toISOString().split("T")[0],
    lastUsed: "Never",
  };
  currentApiKeys.unshift(newKey);
  return c.json({ success: true, data: newKey }, 201);
});

// DELETE /api/account/keys/:id
app.delete("/keys/:id", (c) => {
  const id = c.req.param("id");
  currentApiKeys = currentApiKeys.filter((k) => k.id !== id);
  return c.json({ success: true, message: "API key revoked" });
});

export default app;
