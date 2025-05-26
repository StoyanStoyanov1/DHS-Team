import { ITableColumn } from '../interfaces';

/**
 * Service for handling table data export functionality
 */
export class TableExportService<T> {
  /**
   * Normalizes a value for export based on column type
   */
  public normalizeValue(value: any, column: ITableColumn<T>): string {
    if (value === null || value === undefined) return '';

    // Check column's fieldDataType if available
    const dataType = column.fieldDataType;

    if (typeof value === 'object') {
      if (value instanceof Date || (dataType === 'date' && typeof value === 'string' && !isNaN(Date.parse(value)))) {
        // Format dates consistently
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString();
      } else if (Array.isArray(value)) {
        // Format arrays
        return value.map(item => this.normalizeValue(item, column)).join(', ');
      } else {
        // Format objects
        try {
          // Special handling for common object types
          if (dataType === 'role' && value.name) {
            return value.name; // Assuming role objects have a name property
          }

          if (value.label || value.name || value.title || value.displayName) {
            return value.label || value.name || value.title || value.displayName;
          }

          if (value.value !== undefined) {
            return String(value.value);
          }

          // For Last Login or date-like objects with timestamp
          if (value.timestamp || value.date) {
            const timestamp = value.timestamp || value.date;
            return new Date(timestamp).toLocaleString();
          }

          // For Status-like objects
          if (value.status) {
            return value.status;
          }

          // Default object handling - create a string of key-value pairs
          const objProps = Object.entries(value)
            .map(([key, val]) => `${key}: ${this.normalizeValue(val, { fieldDataType: undefined } as ITableColumn<T>)}`)
            .join(', ');
          return objProps || JSON.stringify(value);
        } catch (e) {
          return JSON.stringify(value);
        }
      }
    } else if (typeof value === 'number') {
      // Format numbers consistently
      return value.toLocaleString();
    } else if (typeof value === 'boolean') {
      // Format booleans
      return value ? (column.labelTrue || 'Yes') : (column.labelFalse || 'No');
    }

    // Default string representation
    return String(value);
  }

  /**
   * Exports table data to CSV format
   */
  public exportToCsv(data: T[], visibleColumns: ITableColumn<T>[], filename: string = 'table-export'): void {
    const headers = visibleColumns.map(col => col.header);
    const exportData = data.map(item => {
      const row: Record<string, any> = {};
      visibleColumns.forEach(col => {
        // Get the raw value for the column
        let value = '';
        if (typeof item === 'object' && item !== null) {
          value = (item as any)[col.key] !== undefined ? (item as any)[col.key] : '';
        }
        row[col.header] = this.normalizeValue(value, col);
      });
      return row;
    });

    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString()}.csv`);
    link.click();
  }

  /**
   * Creates HTML content for PDF export or printing
   */
  public createHtmlContent(
    data: T[], 
    columns: ITableColumn<T>[], 
    title: string = 'Table Export',
    includeRowNumbers: boolean = true
  ): string {
    // Create a clean table with all rows and all columns, with header
    let tableHTML = '<table class="export-table">';

    // Add table header with column names, including a column for row numbers if requested
    tableHTML += '<thead><tr>';
    if (includeRowNumbers) {
      tableHTML += '<th>N</th>'; // Add row number column
    }
    columns.filter(col => !col.key.includes('selection')).forEach(column => {
      tableHTML += `<th>${column.header}</th>`;
    });
    tableHTML += '</tr></thead>';

    // Add table body with data
    tableHTML += '<tbody>';
    data.forEach((item, index) => {
      tableHTML += '<tr>';
      // Add row number cell if requested
      if (includeRowNumbers) {
        tableHTML += `<td>${index + 1}</td>`;
      }
      // Skip adding cells for selection column
      columns.filter(col => !col.key.includes('selection')).forEach(column => {
        let cellContent = '';
        // Always get the raw value first
        const rawValue = (item as any)[column.key];

        if (column.render) {
          // For rendered cells, try to get the text content
          try {
            const renderedContent = column.render(item);
            if (typeof renderedContent === 'string') {
              cellContent = renderedContent;
            } else if (React.isValidElement(renderedContent)) {
              // For React elements, use the normalized raw value instead
              // This ensures consistent formatting for complex objects
              cellContent = this.normalizeValue(rawValue, column);
            } else if (renderedContent === null || renderedContent === undefined) {
              cellContent = '';
            } else {
              // For other types of rendered content, try to convert to string
              cellContent = String(renderedContent);
            }
          } catch (e) {
            // Fallback to raw data if render fails, using normalization
            cellContent = this.normalizeValue(rawValue, column);
          }
        } else {
          // For non-rendered cells, use the raw data with normalization
          cellContent = this.normalizeValue(rawValue, column);
        }
        tableHTML += `<td>${cellContent}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    // Add total count of items
    const totalItemsText = `<div class="total-items">Total items: ${data.length}</div>`;

    // Create styles for the export
    const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background-color: white !important;
          color: black !important;
        }
        .export-table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 10px;
          background-color: white !important;
          color: black !important;
        }
        .export-table th, .export-table td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
          background-color: white !important;
          color: black !important;
        }
        .export-table th {
          background-color: #f2f2f2 !important;
          font-weight: bold;
          color: black !important;
        }
        /* Always use light theme for exports */
        .total-items {
          margin-top: 10px;
          font-weight: bold;
          text-align: right;
          color: black !important;
        }
        /* Override any dark theme styles */
        .dark, .dark * {
          background-color: white !important;
          color: black !important;
        }
        * {
          background-color: white !important;
          color: black !important;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          button, .no-print {
            display: none !important;
          }
        }
      </style>
    `;

    // Create the complete HTML content
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          ${styles}
        </head>
        <body class="light">
          ${tableHTML}
          ${totalItemsText}
        </body>
      </html>
    `;
  }

  /**
   * Prints the table data
   */
  public printTable(data: T[], columns: ITableColumn<T>[], title: string = 'Table Print'): void {
    const htmlContent = this.createHtmlContent(data, columns, title);
    
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // Write to the iframe document
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait for the iframe to load before printing
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (e) {
          console.error('Error printing:', e);
          // Fallback to window.print() if iframe printing fails
          window.print();
          document.body.removeChild(iframe);
        }
      };
    } else {
      // Fallback if iframe document is not available
      document.body.removeChild(iframe);
      window.print();
    }
  }

  /**
   * Exports table data to PDF format
   */
  public exportToPdf(data: T[], columns: ITableColumn<T>[], title: string = 'Table Export'): void {
    const htmlContent = this.createHtmlContent(data, columns, title);
    
    // Create a container for the PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.backgroundColor = 'white';
    container.style.color = 'black';
    container.className = 'light'; // Ensure light theme
    document.body.appendChild(container);

    // Set the container content
    container.innerHTML = htmlContent;

    // Function to convert HTML to canvas
    const html2canvas = (element: HTMLElement): Promise<HTMLCanvasElement> => {
      return new Promise((resolve, reject) => {
        // Load html2canvas from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
          // Now html2canvas is available
          (window as any).html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff', // Force white background
            removeContainer: false, // Keep the container to ensure styles are applied
            ignoreElements: (element: Element) => {
              // Ignore elements with dark theme classes
              return element.classList.contains('dark');
            }
          }).then((canvas: HTMLCanvasElement) => {
            resolve(canvas);
          }).catch((error: any) => {
            reject(error);
          });
        };
        script.onerror = (error) => {
          reject(error);
        };
        document.head.appendChild(script);
      });
    };

    // Function to convert canvas to PDF and download
    const canvasToPdf = (canvas: HTMLCanvasElement, filename: string) => {
      // Load jsPDF from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        // Now jsPDF is available
        // Access jsPDF from the jspdf namespace
        const jspdf = window.jspdf as any;
        const pdf = new jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(`${filename}.pdf`);

        // Clean up
        document.body.removeChild(container);
        document.head.removeChild(script);
      };
      script.onerror = () => {
        console.error('Failed to load jsPDF');
        // Fallback to the old method if jsPDF fails to load
        this.printTable(data, columns, title);
      };
      document.head.appendChild(script);
    };

    // Convert HTML to canvas and then to PDF
    html2canvas(container)
      .then(canvas => {
        canvasToPdf(canvas, title);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        // Fallback to the print method if html2canvas fails
        this.printTable(data, columns, title);
      });
  }
}