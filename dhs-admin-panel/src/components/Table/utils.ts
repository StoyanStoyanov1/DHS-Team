import { ITableColumn } from './interfaces';


export function isSortableColumn<T>(column: ITableColumn<T>): boolean {
  if (column.filterType === 'select' || 
      column.filterType === 'multiselect' || 
      column.filterType === 'boolean') {
    return false;
  }

  return column.sortable === true;
}


export function formatFilterDisplayValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  if (Array.isArray(value)) {
    return `${value.length} избрани`;
  } else if (typeof value === 'object' && value !== null) {
    if (value.start || value.end) {
      const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return '—';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('bg-BG', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      };
      
      const start = formatDate(value.start);
      const end = formatDate(value.end);
      return `${start} - ${end}`;
    } else if (value.min !== undefined || value.max !== undefined) {
      const min = value.min !== undefined && value.min !== null ? value.min : '—';
      const max = value.max !== undefined && value.max !== null ? value.max : '—';
      return `${min} - ${max}`;
    } else if (value.term !== undefined) {
      return `"${value.term}"`;
    }
    return "Персонализиран филтър";
  }
  
  return String(value);
}

/**
 * Добавя CSS стилове за анимации на таблицата
 */
export function addTableStyles(): void {
  if (!document.getElementById('table-context-menu-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'table-context-menu-styles';
    styleElement.textContent = `
      @keyframes menuAppear {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      .sort-indicator-dragging {
        opacity: 0.5;
      }

      th.sort-drop-target {
        background-color: rgba(79, 70, 229, 0.1);
      }

      .sort-criteria-item {
        transition: all 0.2s ease;
      }

      .sort-criteria-item.dragging {
        opacity: 0.5;
        transform: scale(0.98);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .sort-criteria-item.drop-target {
        background-color: rgba(79, 70, 229, 0.1);
        border: 1px dashed rgba(79, 70, 229, 0.5);
      }
    `;
    document.head.appendChild(styleElement);
  }
}

/**
 * Автоматично настройва ширината на колоните на таблицата спрямо съдържанието им
 * @param tableId - ID на HTML таблицата
 * @param minWidth - минимална ширина на колона (в пиксели)
 * @param maxWidth - максимална ширина на колона (в пиксели)
 * @param padding - допълнително padding на колона (в пиксели)
 */
export function autoResizeTableColumns(
  tableId: string, 
  minWidth: number = 60, 
  maxWidth: number = 400, 
  padding: number = 10
): void {
  const table = document.getElementById(tableId) as HTMLTableElement;
  if (!table) return;

  // Създаваме временен div за измерване на ширините на текста
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.whiteSpace = 'nowrap';
  tempDiv.style.overflow = 'hidden';
  document.body.appendChild(tempDiv);

  // Вземаме броя на колоните
  const firstRow = table.rows[0];
  if (!firstRow) {
    document.body.removeChild(tempDiv);
    return;
  }
  
  const numColumns = firstRow.cells.length;
  // Масив за съхранение на максималната ширина за всяка колона
  const columnWidths = new Array(numColumns).fill(0);

  // Изчисляваме максималната ширина за всяка колона
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      
      // Клонираме стиловете на клетката, за да получим точно измерване
      const computedStyle = window.getComputedStyle(cell);
      tempDiv.style.font = computedStyle.font;
      tempDiv.style.fontSize = computedStyle.fontSize;
      tempDiv.style.fontWeight = computedStyle.fontWeight;
      tempDiv.textContent = cell.textContent || '';
      
      // Измерваме ширината на текста + допълнителен padding
      const textWidth = tempDiv.clientWidth + padding;
      
      // Взимаме по-голямата стойност между текущата и новата ширина
      columnWidths[cellIndex] = Math.max(
        columnWidths[cellIndex],
        Math.min(maxWidth, Math.max(minWidth, textWidth))
      );
    }
  }
  
  // Прилагаме изчислените ширини към колоните
  const colgroup = table.querySelector('colgroup') || document.createElement('colgroup');
  if (!table.querySelector('colgroup')) {
    table.insertBefore(colgroup, table.firstChild);
  } else {
    // Изчистваме съществуващите ширини
    colgroup.innerHTML = '';
  }
  
  // Създаваме col елементи с ширини
  for (let i = 0; i < numColumns; i++) {
    const col = document.createElement('col');
    col.style.width = `${columnWidths[i]}px`;
    colgroup.appendChild(col);
  }
  
  // Почистваме временния div
  document.body.removeChild(tempDiv);
}