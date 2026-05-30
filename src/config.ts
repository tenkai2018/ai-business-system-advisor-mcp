export const config = {
  serverName: process.env.MCP_SERVER_NAME || "ai-business-system-advisor",
  serverVersion: process.env.MCP_SERVER_VERSION || "0.1.0",
  publicWebsiteUrl: process.env.PUBLIC_WEBSITE_URL || "",
  bookingUrl: process.env.BOOKING_URL || "",
  beehiivUrl: process.env.BEEHIIV_URL || "",
  gumroadUrl: process.env.GUMROAD_URL || "",
  contactEmail: process.env.CONTACT_EMAIL || "",
  enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === "true",
  enableHttpTransport: process.env.ENABLE_HTTP_TRANSPORT === "true",
  httpPort: Number(process.env.HTTP_PORT || "3000")
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
