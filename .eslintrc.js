module.exports = {
    extends: [
      'plugin:vue/vue3-recommended',
      'eslint:recommended',
      'plugin:prettier/recommended' // Подключение Prettier через ESLint
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error' // Делаем ошибкой несоответствие правилам Prettier
    }
  };