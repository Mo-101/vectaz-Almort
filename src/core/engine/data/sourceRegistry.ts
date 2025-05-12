
/**
 * Data Source Registry
 * 
 * This module tracks the current data source and prevents unauthorized 
 * overwrites of the base data.
 */

// The current data source
let currentSource: "basefile" | "livefeed" | "internal" | "supabase" | null = null;

/**
 * Register a data source
 * @param source The type of data source
 */
export function registerDataSource(source: "basefile" | "livefeed" | "internal" | "supabase"): void {
  // Prevent overwriting the base file source with another source
  if (currentSource === "basefile" && source !== "basefile") {
    const error = new Error("Memory lock violation: Cannot overwrite basefile data source");
    console.error(error);
    throw error;
  }
  
  currentSource = source;
  console.log(`Data source registered as: ${source}`);
}

/**
 * Get the current data source
 * @returns The current data source
 */
export function getCurrentDataSource(): string | null {
  return currentSource;
}

/**
 * Validate that the data source is authorized
 * @param source The source to validate
 * @throws Error if the source is not authorized
 */
export function validateDataSource(source: string): void {
  const authorizedSources = ["basefile", "livefeed", "internal", "supabase"];
  
  if (!authorizedSources.includes(source)) {
    const error = new Error(`Unauthorized data source: ${source}`);
    console.error(error);
    throw error;
  }
}
