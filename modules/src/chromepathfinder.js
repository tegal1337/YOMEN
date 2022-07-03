'use strict';

const karmaChromeLauncher = require('karma-chrome-launcher');

for (const end of ['hrome', 'hromeCanary', 'hromium']) {
	exports[`c${end}`] = karmaChromeLauncher[`launcher:C${end}`][1].prototype.DEFAULT_CMD[process.platform] || null;
}