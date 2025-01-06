import { NhostClient } from "@nhost/react";

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN, // Accessing the subdomain from the environment variable
  region: import.meta.env.VITE_NHOST_REGION        // Accessing the region from the environment variable
});
