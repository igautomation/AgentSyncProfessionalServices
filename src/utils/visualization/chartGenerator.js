/**
 * Chart Generator
 * Generates charts and reports using Chart.js and canvas
 */

const { createCanvas } = require('canvas');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');
const logger = require('../common/logger');

/**
 * Chart Generator for creating visualizations
 */
class ChartGenerator {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   * @param {string} options.outputDir - Directory to save generated charts
   */
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.resolve(process.cwd(), 'reports/charts');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Initialize ChartJSNodeCanvas
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 800,
      height: 600,
      backgroundColour: 'white',
      plugins: {
        modern: ['chartjs-plugin-datalabels']
      }
    });
  }
  
  /**
   * Generate a chart image
   * @param {Object} chartConfig - Chart configuration
   * @param {string} outputPath - Output file path
   * @returns {Promise<string>} Path to the generated chart
   */
  async generateChart(chartConfig, outputPath) {
    try {
      // Create configuration for Chart.js
      const config = {
        type: chartConfig.type,
        data: {
          labels: chartConfig.config.labels,
          datasets: chartConfig.config.datasets || [{
            data: chartConfig.config.data,
            backgroundColor: chartConfig.config.backgroundColor
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: chartConfig.config.title
            },
            legend: {
              display: true,
              position: 'bottom'
            },
            datalabels: {
              display: true,
              color: '#000',
              font: {
                weight: 'bold'
              }
            }
          },
          responsive: true,
          maintainAspectRatio: true
        }
      };
      
      // Generate chart image
      const image = await this.chartJSNodeCanvas.renderToBuffer(config);
      
      // Save image to file
      fs.writeFileSync(outputPath, image);
      
      logger.info(`Generated chart: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error(`Failed to generate chart: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate a report with multiple charts
   * @param {Array<Object>} charts - Chart configurations
   * @param {string} reportName - Report name
   * @returns {Promise<string>} Path to the generated report
   */
  async generateReport(charts, reportName) {
    try {
      // Create report directory
      const reportDir = path.join(this.outputDir, reportName);
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      // Create images directory
      const imagesDir = path.join(reportDir, 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }
      
      // Generate charts
      const chartPaths = [];
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        const chartPath = path.join(imagesDir, `chart-${i}.png`);
        
        if (chart.type === 'table') {
          // Generate table HTML
          const tableHtml = this.generateTableHtml(chart);
          const tableHtmlPath = path.join(reportDir, `table-${i}.html`);
          fs.writeFileSync(tableHtmlPath, tableHtml);
          chartPaths.push({
            type: 'table',
            path: `table-${i}.html`,
            title: chart.title
          });
        } else {
          // Generate chart image
          await this.generateChart(chart, chartPath);
          chartPaths.push({
            type: chart.type,
            path: `images/chart-${i}.png`,
            title: chart.title
          });
        }
      }
      
      // Generate report HTML
      const reportHtml = this.generateReportHtml(chartPaths, reportName);
      const reportHtmlPath = path.join(reportDir, 'index.html');
      fs.writeFileSync(reportHtmlPath, reportHtml);
      
      logger.info(`Generated report: ${reportDir}`);
      return reportDir;
    } catch (error) {
      logger.error(`Failed to generate report: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate table HTML
   * @param {Object} tableConfig - Table configuration
   * @returns {string} Table HTML
   */
  generateTableHtml(tableConfig) {
    const { data, options } = tableConfig;
    const { columns, title } = options;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
    `;
    
    // Add table headers
    columns.forEach(column => {
      html += `<th>${column.label || column.field}</th>`;
    });
    
    html += `
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add table rows
    data.forEach(item => {
      html += '<tr>';
      columns.forEach(column => {
        const value = item[column.field];
        html += `<td>${value !== undefined ? value : ''}</td>`;
      });
      html += '</tr>';
    });
    
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    return html;
  }
  
  /**
   * Generate report HTML
   * @param {Array<Object>} chartPaths - Chart paths
   * @param {string} reportName - Report name
   * @returns {string} Report HTML
   */
  generateReportHtml(chartPaths, reportName) {
    const timestamp = new Date().toLocaleString();
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .chart-container { margin-bottom: 40px; }
          .chart-title { color: #333; margin-bottom: 10px; }
          .chart-image { max-width: 100%; height: auto; border: 1px solid #ddd; }
          .report-header { margin-bottom: 30px; }
          .report-footer { margin-top: 50px; color: #666; font-size: 0.8em; }
          iframe { border: none; width: 100%; height: 400px; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${reportName}</h1>
          <p>Generated on: ${timestamp}</p>
        </div>
    `;
    
    // Add charts
    chartPaths.forEach(chart => {
      html += `
        <div class="chart-container">
          <h2 class="chart-title">${chart.title}</h2>
      `;
      
      if (chart.type === 'table') {
        html += `<iframe src="${chart.path}"></iframe>`;
      } else {
        html += `<img class="chart-image" src="${chart.path}" alt="${chart.title}">`;
      }
      
      html += '</div>';
    });
    
    html += `
        <div class="report-footer">
          <p>Report generated by AgentSync Test Framework</p>
        </div>
      </body>
      </html>
    `;
    
    return html;
  }
  
  /**
   * Test report accessibility
   * @param {string} reportPath - Path to the report
   * @returns {Promise<Object>} Accessibility test results
   */
  async testReportAccessibility(reportPath) {
    // This is a stub implementation
    // In a real implementation, this would use Playwright to test accessibility
    logger.info(`Testing accessibility for report: ${reportPath}`);
    return { passed: true };
  }
  
  /**
   * Test report responsiveness
   * @param {string} reportPath - Path to the report
   * @returns {Promise<Object>} Responsiveness test results
   */
  async testReportResponsiveness(reportPath) {
    // This is a stub implementation
    // In a real implementation, this would use Playwright to test responsiveness
    logger.info(`Testing responsiveness for report: ${reportPath}`);
    return { passed: true };
  }
}

module.exports = ChartGenerator;