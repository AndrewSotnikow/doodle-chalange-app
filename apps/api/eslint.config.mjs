import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  tseslint.configs.strictTypeChecked,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '.git/',
      'package-lock.json',
      '*.config.{js,ts,mjs}',
      '*.d.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
