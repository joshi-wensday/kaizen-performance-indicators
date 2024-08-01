const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const pkg = require('./package.json');

module.exports = [
  // Browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'kaizenPIsLibrary',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' })
    ]
  }
];