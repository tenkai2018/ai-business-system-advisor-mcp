function envValue(name: string): string {
  return typeof process !== "undefined" && process.env ? process.env[name] || "" : "";
}

export const config = {
  serverName: envValue("MCP_SERVER_NAME") || "ai-business-system-advisor",
  serverVersion: envValue("MCP_SERVER_VERSION") || "0.1.4",
  publicWebsiteUrl: envValue("PUBLIC_WEBSITE_URL"),
  bookingUrl: envValue("BOOKING_URL"),
  beehiivUrl: envValue("BEEHIIV_URL"),
  gumroadUrl: envValue("GUMROAD_URL"),
  contactEmail: envValue("CONTACT_EMAIL"),
  enableDebugLogs: envValue("ENABLE_DEBUG_LOGS") === "true",
  enableHttpTransport: envValue("ENABLE_HTTP_TRANSPORT") === "true",
  httpPort: Number(envValue("HTTP_PORT") || "3000")
};

export function configuredCtas(): string[] {
  return [
    config.publicWebsiteUrl ? `Website: ${config.publicWebsiteUrl}` : "",
    config.bookingUrl ? `Booking: ${config.bookingUrl}` : "",
    config.beehiivUrl ? `Newsletter: ${config.beehiivUrl}` : "",
    config.gumroadUrl ? `Resources: ${config.gumroadUrl}` : "",
    config.contactEmail ? `Contact: ${config.contactEmail}` : ""
  ].filter(Boolean);
}
