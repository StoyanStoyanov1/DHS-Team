/**
 * Service for handling table appearance settings
 */
export class TableAppearanceService {
  /**
   * Adds CSS styles for table appearance
   */
  public addTableStyles(): void {
    // Check if styles are already added
    if (document.getElementById('table-appearance-styles')) {
      return;
    }

    // Create refresh button animation style and table appearance styles
    const styleElement = document.createElement('style');
    styleElement.id = 'table-appearance-styles';
    styleElement.textContent = `
      /* Refresh button animation */
      @keyframes rotate360 {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(-360deg);
        }
      }
      .refresh-rotate {
        animation: rotate360 0.5s ease-in-out forwards;
      }

      /* Table appearance settings */
      .table-compact td, .table-compact th {
        padding: 0.5rem !important;
      }

      .table-relaxed td, .table-relaxed th {
        padding: 1.25rem !important;
      }

      .table-striped tbody tr:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .dark .table-striped tbody tr:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.02);
      }

      .table-hover tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .dark .table-hover tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }

      .sticky-header thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: white;
      }

      .dark .sticky-header thead {
        background-color: #1f2937;
      }

      /* Dark mode styles */
      .dark {
        color-scheme: dark;
      }

      .dark body {
        background-color: #111827;
        color: #f3f4f6;
      }

      .dark .bg-white {
        background-color: #1f2937 !important;
      }

      .dark .bg-gray-50 {
        background-color: #111827 !important;
      }

      .dark .bg-gray-100 {
        background-color: #1f2937 !important;
      }

      .dark .text-gray-700 {
        color: #f3f4f6 !important;
      }

      .dark .text-gray-800 {
        color: #f9fafb !important;
      }

      .dark .text-gray-900 {
        color: #ffffff !important;
      }

      .dark .border-gray-200 {
        border-color: #374151 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }

  /**
   * Removes CSS styles for table appearance
   */
  public removeTableStyles(): void {
    const styleElement = document.getElementById('table-appearance-styles');
    if (styleElement) {
      document.head.removeChild(styleElement);
    }
  }

  /**
   * Computes table class names based on appearance settings
   */
  public computeTableClassNames(
    showGridLines: boolean,
    stripedRows: boolean,
    highlightOnHover: boolean,
    density: 'compact' | 'normal' | 'relaxed'
  ): string {
    let classes = "min-w-full ";

    // Grid lines
    if (showGridLines) {
      classes += "border border-gray-200 dark:border-gray-700 ";
    } else {
      classes += "divide-y divide-gray-200 dark:divide-gray-700 ";
    }

    // Striped rows
    if (stripedRows) {
      classes += "table-striped ";
    }

    // Highlight on hover
    if (highlightOnHover) {
      classes += "table-hover ";
    }

    // Row density
    if (density === 'compact') {
      classes += "table-compact ";
    } else if (density === 'relaxed') {
      classes += "table-relaxed ";
    }

    return classes.trim();
  }

  /**
   * Determines if dark mode should be applied based on theme settings
   */
  public shouldUseDarkMode(
    theme: 'light' | 'dark' | 'site',
    siteTheme: 'light' | 'dark' | 'system'
  ): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    
    // For 'site', use the site's theme
    if (theme === 'site') {
      if (siteTheme === 'dark') return true;
      if (siteTheme === 'light') return false;
      
      // If siteTheme is 'system', check system preference
      if (siteTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    
    // Fallback to system preference (should not happen with current options)
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Auto-resizes table columns based on content
   */
  public autoResizeTableColumns(
    tableId: string,
    minColumnWidth?: number,
    maxColumnWidth?: number,
    columnPadding?: number
  ): void {
    // Defer to next frame to ensure DOM is updated
    setTimeout(() => {
      const table = document.getElementById(tableId);
      if (!table) return;

      const headerCells = table.querySelectorAll('thead th');
      const rows = table.querySelectorAll('tbody tr');
      
      // Skip if no header cells or rows
      if (!headerCells.length || !rows.length) return;

      // Calculate optimal width for each column
      headerCells.forEach((headerCell, columnIndex) => {
        // Skip selection column
        if (headerCell.classList.contains('selection-column')) return;

        // Get content width of header cell
        const headerContent = headerCell.textContent || '';
        const headerWidth = this.getTextWidth(headerContent) + (columnPadding || 40); // Default padding

        // Find max content width in column cells
        let maxCellWidth = 0;
        rows.forEach(row => {
          const cell = row.cells[columnIndex];
          if (cell) {
            const cellContent = cell.textContent || '';
            const cellWidth = this.getTextWidth(cellContent) + (columnPadding || 40);
            maxCellWidth = Math.max(maxCellWidth, cellWidth);
          }
        });

        // Use the larger of header width or max cell width
        let optimalWidth = Math.max(headerWidth, maxCellWidth);
        
        // Apply min/max constraints if provided
        if (minColumnWidth !== undefined) {
          optimalWidth = Math.max(optimalWidth, minColumnWidth);
        }
        if (maxColumnWidth !== undefined) {
          optimalWidth = Math.min(optimalWidth, maxColumnWidth);
        }

        // Apply width to header cell
        (headerCell as HTMLElement).style.width = `${optimalWidth}px`;
        (headerCell as HTMLElement).style.minWidth = `${optimalWidth}px`;
      });
    }, 0);
  }

  /**
   * Helper method to calculate text width
   */
  private getTextWidth(text: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 0;
    
    // Use a standard font size and family
    context.font = '14px Arial, sans-serif';
    const metrics = context.measureText(text);
    return metrics.width;
  }
}