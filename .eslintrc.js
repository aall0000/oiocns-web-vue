module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 禁用 debugger
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 禁用 console
    'no-bitwise': 'off', // 禁用按位运算符
    'no-tabs': 'off', // 禁用 tab
    'space-before-function-paren': 'warn',
    'vue/html-closing-bracket-newline': 'off',
    'vue/script-setup-uses-vars': 'off',
    // 执行自闭合的风格
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],

    'array-element-newline': ['error', 'consistent'], // 强制数组元素间出现换行
    indent: ['error', 2, { MemberExpression: 0, SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }], // 强制使用一致的缩进
    quotes: ['error', 'single'], // 强制使用一致的反勾号、双引号或单引号
    'comma-dangle': ['error', 'always-multiline'], // 要求或禁止末尾逗号
    'object-curly-spacing': ['error', 'always'], // 强制在大括号中使用一致的空格
    'max-len': ['error', 120], // 强制一行的最大长度
    'linebreak-style': 'off', // 强制使用一致的换行风格
    'eol-last': 'off', // 要求或禁止文件末尾存在空行
    'no-shadow': 'off', // 禁止变量声明与外层作用域的变量同名
    'no-unused-vars': 'warn', // 禁止出现未使用过的变量
    'arrow-parens': 'off', // 要求箭头函数的参数使用圆括号
    semi: ['error', 'never'], // 要求或禁止使用分号代替 ASI
    eqeqeq: 1, // 要求使用 === 和 !==
    'no-use-before-define': 'warn', // 禁止在变量定义之前使用它们，则倾向于默认输出
    'prefer-destructuring': 'off', // 优先使用数组和对象解构
    'prefer-const': 'warn', // 要求使用 const 声明那些声明后不再被修改的变量
    'one-var-declaration-per-line': 'off', // 要求或禁止在变量声明周围换行
    'import/named': 'off', // 确保命名导入与远程文件中的命名导出相对应
    'object-curly-newline': 'off', // 强制大括号内换行符的一致性
    'default-case': 'warn', // 要求 switch 语句中有 default 分支
    'no-trailing-spaces': 'off', // 禁用行尾空格
    'func-names': 'off', // 要求或禁止使用命名的 function 表达式
    'no-unused-expressions': 'off', // 禁止出现未使用过的表达式
    'no-underscore-dangle': 'off', // 禁止标识符中有悬空下划线
    'no-nested-ternary': 'off', // 禁用嵌套的三元表达式
    'no-await-in-loop': 'warn', // 禁止在循环中出现 await
    'import/no-extraneous-dependencies': 'off', // 禁止使用外部包
    'template-curly-spacing': ['error', 'always'], // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    '@typescript-eslint/no-empty-function': 'warn', // 不允许空函数
    '@typescript-eslint/no-explicit-any': 'warn', // 禁止使用 any 类型
    'vue/html-indent': ['error', 2], // 在<template>中强制一致缩进
    'vue/max-attributes-per-line': [
      // 强制每行属性的最大数量
      'warn',
      {
        singleline: {
          max: 3,
          allowFirstLine: true
        },
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off' // 要求单行元素的内容前后有一个换行符
  }
}
