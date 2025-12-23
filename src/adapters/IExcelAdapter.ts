/**
 * =============================================================================
 * EXCEL ADAPTER INTERFACE (Domain Layer - Abstraction)
 * =============================================================================
 * 
 * This interface defines the contract for Excel import/export operations.
 * Following the Dependency Inversion Principle (DIP), we depend on this
 * abstraction rather than concrete implementations.
 * 
 * This allows us to:
 * - Swap xlsx library for another without changing business logic
 * - Mock the adapter for testing
 * - Add different implementations (e.g., CSV adapter) with same interface
 */

export interface ImportResult<T> {
  /** Successfully parsed and validated rows */
  success: T[];
  /** Rows that failed validation with error details */
  errors: ImportError[];
  /** Total rows processed */
  totalRows: number;
}

export interface ImportError {
  /** Row number in the Excel file (1-indexed) */
  row: number;
  /** The raw data from that row */
  data: Record<string, unknown>;
  /** Validation error messages */
  errors: string[];
}

export interface ExportColumn<T> {
  /** Column header name */
  header: string;
  /** Function to extract value from data object */
  accessor: (item: T) => string | number | boolean | null;
  /** Optional: Custom cell formatting */
  format?: (value: unknown) => string;
}

export interface IExcelAdapter {
  /**
   * Import data from an Excel file
   * 
   * @param file - The Excel file to import
   * @param validator - Function that validates each row
   * @param mapper - Optional function to transform raw data before validation
   * @returns Promise with success/error results
   */
  importFile<T>(
    file: File,
    validator: (data: unknown) => { success: boolean; data?: T; errors?: string[] },
    mapper?: (raw: Record<string, unknown>) => Record<string, unknown>
  ): Promise<ImportResult<T>>;

  /**
   * Export data to Excel file
   * 
   * @param data - Array of objects to export
   * @param columns - Column definitions
   * @param filename - Name of the downloaded file (without extension)
   */
  exportToExcel<T>(
    data: T[],
    columns: ExportColumn<T>[],
    filename: string
  ): void;
}
