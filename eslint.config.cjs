// eslint.config.cjs
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')

// carrega os plugins em flat
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const reactNative = require('eslint-plugin-react-native')

// TypeScript (somente parser; regras você ajusta depois se quiser)
const tsParser = require('@typescript-eslint/parser')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

module.exports = [
  // substitui o .eslintignore (pode apagar o arquivo)
  { ignores: ['node_modules', 'android', 'ios', 'build', 'dist'] },

  // Regras base recomendadas do ESLint
  js.configs.recommended,

  // Preset da Rocketseat para React (legacy -> flat via compat)
  ...compat.extends('@rocketseat/eslint-config/react'),

  // React e React Hooks (aplica as recomendadas diretamente)
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...(react.configs.recommended?.rules || {}),
      ...(react.configs['jsx-runtime']?.rules || {}),
      ...(reactHooks.configs.recommended?.rules || {}),
    },
  },

  // React Native: em vez de 'extends: plugin:react-native/recommended',
  // aplicamos as regras recomendadas diretamente (resolve seu erro).
  {
    plugins: { 'react-native': reactNative },
    rules: {
      ...(reactNative.configs.recommended?.rules || {}),
      // ajustes extras que muita gente usa:
      'react-native/no-inline-styles': 'warn',
      'react-native/no-unused-styles': 'warn',
    },
  },

  // Arquivos TS/TSX: parser + JSX
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // se quiser regras type-aware depois: project: ['./tsconfig.json'],
      },
    },
  },
]
