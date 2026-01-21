/**
 * =============================================================================
 * XLSX ADAPTER IMPLEMENTATION (Infrastructure Layer)
 * =============================================================================
 * 
 * Concrete implementation of IExcelAdapter using the xlsx library.
 * 
 * RESPONSIBILITIES:
 * - Parse Excel files into JSON
 * - Validate file types and size
 * - Generate Excel files from JSON data
 * - Handle file downloads
 * 
 * LIMITATIONS:
 * - Maximum file size: 10MB
 * - Supported formats: .xlsx, .xls
 * - Maximum 10,000 rows per import
 */

import * as XLSX from "xlsx";
import type { IExcelAdapter, ImportResult, ImportError, ExportColumn } from "./IExcelAdapter";

class XlsxAdapter implements IExcelAdapter {
  private static instance: XlsxAdapter;
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_ROWS = 10000;
  private readonly ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
  ];

  private constructor() {}

  static getInstance(): XlsxAdapter {
    if (!XlsxAdapter.instance) {
      XlsxAdapter.instance = new XlsxAdapter();
    }
    return XlsxAdapter.instance;
  }

  /**
   * Validate the uploaded file before processing
   */
  private validateFile(file: File): void {
    if (!file || !(file instanceof File)) {
      throw new Error("Arquivo inválido");
    }

    if (!this.ALLOWED_TYPES.includes(file.type) && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls')) {
      throw new Error("Formato de arquivo não suportado. Use .xlsx ou .xls");
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  }

  /**
   * Import data from Excel file
   */
  async importFile<T>(
    file: File,
    validator: (data: unknown) => { success: boolean; data?: T; errors?: string[] },
    mapper?: (raw: Record<string, unknown>) => Record<string, unknown>
  ): Promise<ImportResult<T>> {
    this.validateFile(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });

          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            reject(new Error("Planilha vazia ou sem abas"));
            return;
          }

          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON (skip empty rows)
          const rawData = XLSX.utils.sheet_to_json(worksheet, {
            defval: null, // Set null for empty cells
            blankrows: false, // Skip blank rows
          }) as Record<string, unknown>[];

          if (rawData.length === 0) {
            reject(new Error("Planilha vazia"));
            return;
          }

          if (rawData.length > this.MAX_ROWS) {
            reject(new Error(`Muitas linhas. Máximo: ${this.MAX_ROWS}`));
            return;
          }

          // Process and validate each row
          const success: T[] = [];
          const errors: ImportError[] = [];

          rawData.forEach((row, index) => {
            const rowNumber = index + 2; // +2 because Excel is 1-indexed and row 1 is headers

            try {
              // Apply optional mapper to transform raw data
              const mappedRow = mapper ? mapper(row) : row;

              // Validate the row
              const validationResult = validator(mappedRow);

              if (validationResult.success && validationResult.data) {
                success.push(validationResult.data);
              } else {
                errors.push({
                  row: rowNumber,
                  data: row,
                  errors: validationResult.errors || ["Erro de validação desconhecido"],
                });
              }
            } catch (error) {
              errors.push({
                row: rowNumber,
                data: row,
                errors: [error instanceof Error ? error.message : "Erro ao processar linha"],
              });
            }
          });

          resolve({
            success,
            errors,
            totalRows: rawData.length,
          });
        } catch (error) {
          reject(new Error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : "Erro desconhecido"}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler arquivo"));
      };

      reader.readAsBinaryString(file);
    });
  }

  /**
   * Export data to Excel file and trigger download
   */
  exportToExcel<T>(
    data: T[],
    columns: ExportColumn<T>[],
    filename: string
  ): void {
    if (!data || data.length === 0) {
      throw new Error("Nenhum dado para exportar");
    }

    // Transform data into rows with headers
    const rows = data.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        const value = col.accessor(item);
        row[col.header] = col.format ? col.format(value) : value;
      });
      return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns
    const maxWidths: Record<string, number> = {};
    columns.forEach((col) => {
      maxWidths[col.header] = col.header.length;
    });

    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const value = String(row[key] ?? "");
        maxWidths[key] = Math.max(maxWidths[key] || 0, value.length);
      });
    });

    worksheet["!cols"] = columns.map((col) => ({
      wch: Math.min(maxWidths[col.header] + 2, 50), // Max width 50
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    // Generate file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}

export default XlsxAdapter.getInstance();
