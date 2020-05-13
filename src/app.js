const Analyzer = require('./Analyzer');

async function init() {
  const analyzer = new Analyzer();
  await analyzer.loadModels();
}
init();
