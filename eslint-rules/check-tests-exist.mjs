import fs from 'fs';
import path from 'path';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure every file in src has a corresponding test file in tests',
      recommended: false,
    },
    schema: [], // No additional options
  },
  create(context) {
    const settings = context.settings || {};
    const srcDir = settings.srcDir || path.resolve('src');
    const testDir = settings.testDir || path.resolve('tests');

    const srcFiles = fs
      .readdirSync(srcDir, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(js|ts|vue)$/.test(entry.name))
      .map(entry => entry.name);

    return {
      Program(node) {
        srcFiles.forEach(file => {
          const testFileName = file.replace(/\.(js|ts|vue)$/, '.test.$1');
          const testFilePath = path.join(testDir, testFileName);

          if (!fs.existsSync(testFilePath)) {
            context.report({
              node,
              message: `Test file missing for "${file}". Expected at "${testFilePath}"`,
            });
          }
        });
      },
    };
  },
};
