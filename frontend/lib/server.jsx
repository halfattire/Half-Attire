
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://halfattire-backend.onrender.com"

// API server URL
export const server = `${BACKEND_BASE_URL}/api`

// Legacy export for backward compatibility
export const backend_url = BACKEND_BASE_URL
