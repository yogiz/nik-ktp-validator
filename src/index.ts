import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loadAdminAreaData } from "./data/adminAreaData";
import nikRoutes from "./routes/nik";

// Define the type for adminAreaData
type AdminAreaData = Awaited<ReturnType<typeof loadAdminAreaData>>;

// Extend the Hono context type
declare module "hono" {
  interface ContextVariableMap {
    adminAreaData: AdminAreaData;
  }
}

const app = new Hono();

app.get("/", (c) => c.text("API for Indonesian ID Card Identification"));

app.use("/api/*", async (c, next) => {
  if (!c.get("adminAreaData")) {
    const adminAreaData = await loadAdminAreaData();
    c.set("adminAreaData", adminAreaData);
  }
  await next();
});

app.route("/api/nik", nikRoutes);

const port = 5000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
