/**
 * Plugins module
 * Exports plugin loader and related utilities
 */

const pluginLoader = require('./plugin-loader');

module.exports = {
  /**
   * Load plugins from configuration
   * @returns {Object} Loaded plugins
   */
  loadPlugins: () => pluginLoader.loadPlugins(),
  
  /**
   * Get plugin by name
   * @param {string} name - Plugin name
   * @returns {Object} Plugin instance
   */
  getPlugin: (name) => pluginLoader.getPlugin(name),
  
  /**
   * Get all loaded plugins
   * @returns {Object} All plugin instances
   */
  getPlugins: () => pluginLoader.getPlugins(),
  
  /**
   * Load framework configuration
   * @returns {Object} Framework configuration
   */
  loadConfig: () => pluginLoader.loadConfig()
};