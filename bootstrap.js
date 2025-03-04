require('module-alias/register');
require('ts-node').register({
    project: './tsconfig.json',
});
require('./src/index.ts'); 