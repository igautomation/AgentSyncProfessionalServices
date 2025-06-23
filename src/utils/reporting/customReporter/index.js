/**
 * Custom Reporter implementation
 * Provides reporting functionality for test results
 */

class CustomReporter {
  constructor(options = {}) {
    this.options = options;
    this.results = [];
  }

  /**
   * Record a test result
   * @param {Object} result - Test result data
   */
  recordResult(result) {
    this.results.push(result);
    return this;
  }

  /**
   * Generate a report from collected results
   * @returns {Object} Generated report
   */
  generateReport() {
    return {
      summary: this.generateSummary(),
      results: this.results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate summary statistics
   * @returns {Object} Summary statistics
   */
  generateSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? (passed / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}

module.exports = { CustomReporter };