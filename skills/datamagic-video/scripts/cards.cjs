#!/usr/bin/env node
// Compatibility for previously documented helper paths; the skill is now datamagic.
const helper = require('../../datamagic/scripts/cards.cjs');
module.exports = helper;
if (require.main === module) {
  try { process.stdout.write(JSON.stringify(helper.run(process.argv.slice(2)), null, 2) + '\n'); }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
