// Checks if all required environment variables are set, and exits if any are missing
export function validateEnv(requiredVars: string[]) {
  // Find environment variables that are missing
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // Log missing variables and exit the process with failure
    console.error("Missing environment variables:", missing.join(", "));
    process.exit(1);
  }
}
