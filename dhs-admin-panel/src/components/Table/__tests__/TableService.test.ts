import { TableService } from '../TableService';
import { SortDirection } from '../interfaces';

describe('TableService', () => {
  let tableService: TableService<any>;
  
  // Sample data for testing
  const testData = [
    { id: 1, name: 'John', age: 30, nested: { value: 'A' } },
    { id: 2, name: 'Alice', age: 25, nested: { value: 'B' } },
    { id: 3, name: 'Bob', age: 35, nested: { value: 'C' } },
    { id: 4, name: 'Eve', age: 28, nested: { value: 'D' } },
    { id: 5, name: 'Charlie', age: 40, nested: { value: 'E' } },
  ];

  beforeEach(() => {
    tableService = new TableService<any>();
  });

  describe('getPaginatedData', () => {
    test('should return the correct slice of data for the first page', () => {
      const result = tableService.getPaginatedData(testData, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    test('should return the correct slice of data for the second page', () => {
      const result = tableService.getPaginatedData(testData, 2, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(4);
    });

    test('should return the correct slice of data for the last page with fewer items', () => {
      const result = tableService.getPaginatedData(testData, 3, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(5);
    });

    test('should return an empty array if the page is beyond the data range', () => {
      const result = tableService.getPaginatedData(testData, 4, 2);
      expect(result).toHaveLength(0);
    });

    test('should handle empty data array', () => {
      const result = tableService.getPaginatedData([], 1, 10);
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateTotalPages', () => {
    test('should calculate the correct number of pages', () => {
      expect(tableService.calculateTotalPages(10, 3)).toBe(4);
      expect(tableService.calculateTotalPages(10, 5)).toBe(2);
      expect(tableService.calculateTotalPages(10, 10)).toBe(1);
      expect(tableService.calculateTotalPages(10, 15)).toBe(1);
    });

    test('should handle zero items', () => {
      expect(tableService.calculateTotalPages(0, 5)).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(tableService.calculateTotalPages(1, 1)).toBe(1);
      expect(tableService.calculateTotalPages(5, 5)).toBe(1);
      expect(tableService.calculateTotalPages(6, 5)).toBe(2);
    });
  });

  describe('sortData', () => {
    test('should return a copy of the data if sortKey is not provided', () => {
      const result = tableService.sortData(testData, '', null);
      expect(result).toEqual(testData);
      expect(result).not.toBe(testData); // Should be a new array
    });

    test('should return a copy of the data if sortDirection is null', () => {
      const result = tableService.sortData(testData, 'name', null);
      expect(result).toEqual(testData);
      expect(result).not.toBe(testData); // Should be a new array
    });

    test('should sort string values in ascending order', () => {
      const result = tableService.sortData(testData, 'name', 'asc');
      expect(result.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Eve', 'John']);
    });

    test('should sort string values in descending order', () => {
      const result = tableService.sortData(testData, 'name', 'desc');
      expect(result.map(item => item.name)).toEqual(['John', 'Eve', 'Charlie', 'Bob', 'Alice']);
    });

    test('should sort numeric values in ascending order', () => {
      const result = tableService.sortData(testData, 'age', 'asc');
      expect(result.map(item => item.age)).toEqual([25, 28, 30, 35, 40]);
    });

    test('should sort numeric values in descending order', () => {
      const result = tableService.sortData(testData, 'age', 'desc');
      expect(result.map(item => item.age)).toEqual([40, 35, 30, 28, 25]);
    });

    test('should sort using nested properties', () => {
      const result = tableService.sortData(testData, 'nested.value', 'asc');
      expect(result.map(item => item.nested.value)).toEqual(['A', 'B', 'C', 'D', 'E']);
    });

    test('should use custom sort function if provided', () => {
      const customSortFn = (a: any, b: any, direction: SortDirection) => {
        // Sort by name length
        const diff = a.name.length - b.name.length;
        return direction === 'asc' ? diff : -diff;
      };

      const result = tableService.sortData(testData, 'name', 'asc', customSortFn);
      expect(result.map(item => item.name)).toEqual(['Bob', 'Eve', 'John', 'Alice', 'Charlie']);

      const resultDesc = tableService.sortData(testData, 'name', 'desc', customSortFn);
      expect(resultDesc.map(item => item.name)).toEqual(['Charlie', 'Alice', 'John', 'Bob', 'Eve']);
    });

    test('should handle null or undefined values', () => {
      const dataWithNulls = [
        { id: 1, name: 'John', value: null },
        { id: 2, name: 'Alice', value: 'B' },
        { id: 3, name: 'Bob', value: undefined },
        { id: 4, name: 'Eve', value: 'D' },
      ];

      const result = tableService.sortData(dataWithNulls, 'value', 'asc');
      // Null and undefined should be treated as the smallest values
      expect(result.map(item => item.value)).toEqual([null, undefined, 'B', 'D']);
    });
  });
});