require('module-alias/register');
require('ts-node').register({
    project: './tsconfig.json', // Optional, specify the tsconfig if needed
});
require('./src/index.ts'); // Replace 'main.ts' with the path to your main TypeScript file
