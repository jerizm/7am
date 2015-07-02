import debug from 'debug';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

let config;

if (!config) {
  debugger;
  let filePath = path.join(__dirname, 'config.yml');
  config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
}
debug('config')(config);

export default config;
