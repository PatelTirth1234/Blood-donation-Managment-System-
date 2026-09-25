/**
 * RaktSetu / HemaCare OS — Application Entry Point (Node.js)
 */

const { app, startServer } = require('./server');

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
