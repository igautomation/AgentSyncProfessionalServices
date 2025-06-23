/**
 * Data Analyzer
 * Analyzes and transforms data for visualization
 */

const logger = require('../common/logger');

/**
 * Data Analyzer for preparing data for visualizations
 */
class DataAnalyzer {
  /**
   * Constructor
   */
  constructor() {
    // Default color palette for charts
    this.colorPalette = [
      '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
      '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
    ];
  }
  
  /**
   * Filter data based on a predicate function
   * @param {Array<Object>} data - Data to filter
   * @param {Function} predicate - Filter predicate
   * @returns {Array<Object>} Filtered data
   */
  filter(data, predicate) {
    return data.filter(predicate);
  }
  
  /**
   * Group data by a field
   * @param {Array<Object>} data - Data to group
   * @param {string} field - Field to group by
   * @returns {Object} Grouped data
   */
  groupBy(data, field) {
    return data.reduce((groups, item) => {
      const key = item[field];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }
  
  /**
   * Aggregate data
   * @param {Array<Object>} data - Data to aggregate
   * @param {string} groupField - Field to group by
   * @param {string} valueField - Field to aggregate
   * @param {string} aggregation - Aggregation function (sum, avg, count, min, max)
   * @returns {Object} Aggregated data
   */
  aggregate(data, groupField, valueField, aggregation = 'sum') {
    const groups = this.groupBy(data, groupField);
    const result = {};
    
    for (const key in groups) {
      const values = groups[key].map(item => parseFloat(item[valueField]));
      
      switch (aggregation) {
        case 'sum':
          result[key] = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          result[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'count':
          result[key] = values.length;
          break;
        case 'min':
          result[key] = Math.min(...values);
          break;
        case 'max':
          result[key] = Math.max(...values);
          break;
        default:
          result[key] = values.reduce((sum, val) => sum + val, 0);
      }
    }
    
    return result;
  }
  
  /**
   * Prepare data for charts
   * @param {Array<Object>} data - Data to prepare
   * @param {string} labelField - Field to use for labels
   * @param {string|Array<string>} valueField - Field(s) to use for values
   * @param {string} chartType - Chart type (bar, line, pie)
   * @returns {Object} Prepared chart data
   */
  prepareChartData(data, labelField, valueField, chartType = 'bar') {
    try {
      if (chartType === 'pie') {
        // Prepare data for pie chart
        const aggregated = this.aggregate(data, labelField, valueField, 'sum');
        const labels = Object.keys(aggregated);
        const values = Object.values(aggregated);
        
        // Generate colors
        const backgroundColor = labels.map((_, i) => this.colorPalette[i % this.colorPalette.length]);
        
        return {
          labels,
          data: values,
          backgroundColor
        };
      } else {
        // Prepare data for bar or line chart
        const labels = [...new Set(data.map(item => item[labelField]))];
        
        // Handle multiple value fields
        const valueFields = Array.isArray(valueField) ? valueField : [valueField];
        
        const datasets = valueFields.map((field, index) => {
          const aggregated = this.aggregate(data, labelField, field, 'sum');
          
          return {
            label: field,
            data: labels.map(label => aggregated[label] || 0),
            backgroundColor: this.colorPalette[index % this.colorPalette.length],
            borderColor: chartType === 'line' ? this.colorPalette[index % this.colorPalette.length] : undefined,
            fill: chartType === 'line' ? false : undefined
          };
        });
        
        return {
          labels,
          datasets
        };
      }
    } catch (error) {
      logger.error(`Failed to prepare chart data: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Calculate statistics for a dataset
   * @param {Array<Object>} data - Data to analyze
   * @param {string} field - Field to analyze
   * @returns {Object} Statistics
   */
  calculateStatistics(data, field) {
    try {
      const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
      
      if (values.length === 0) {
        return {
          count: 0,
          sum: 0,
          avg: 0,
          min: 0,
          max: 0,
          median: 0,
          stdDev: 0
        };
      }
      
      // Sort values for median and percentiles
      const sortedValues = [...values].sort((a, b) => a - b);
      
      // Calculate statistics
      const count = values.length;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / count;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      // Calculate median
      const midIndex = Math.floor(count / 2);
      const median = count % 2 === 0
        ? (sortedValues[midIndex - 1] + sortedValues[midIndex]) / 2
        : sortedValues[midIndex];
      
      // Calculate standard deviation
      const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / count;
      const stdDev = Math.sqrt(variance);
      
      return {
        count,
        sum,
        avg,
        min,
        max,
        median,
        stdDev
      };
    } catch (error) {
      logger.error(`Failed to calculate statistics: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Detect outliers in a dataset
   * @param {Array<Object>} data - Data to analyze
   * @param {string} field - Field to analyze
   * @returns {Array<Object>} Outliers
   */
  detectOutliers(data, field) {
    try {
      const stats = this.calculateStatistics(data, field);
      const threshold = stats.stdDev * 2; // 2 standard deviations
      
      return data.filter(item => {
        const value = parseFloat(item[field]);
        return Math.abs(value - stats.avg) > threshold;
      });
    } catch (error) {
      logger.error(`Failed to detect outliers: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Set color palette
   * @param {Array<string>} colors - Color palette
   */
  setColorPalette(colors) {
    if (Array.isArray(colors) && colors.length > 0) {
      this.colorPalette = colors;
    }
  }
}

module.exports = DataAnalyzer;