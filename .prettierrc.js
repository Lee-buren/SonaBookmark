/**
 * @type {import('prettier').Options}
 */
export default {
  eslintIntegration: true,
  printWidth: 120, // 一行最多 120 字符(默认80)
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）
  useTabs: false, // 是否使用tab进行缩进（默认false）
  semi: true, // 行尾需要有分号(默认true)
  singleQuote: true, // 使用单引号（默认false）
  quoteProps: 'as-needed', // 对象的 key 仅在必要时用引号
  jsxSingleQuote: true, // jsx 不使用单引号，而使用双引号
  trailingComma: 'none', // 多行使用拖尾逗号（默认none）
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"（默认true）
  arrowParens: 'avoid', // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid:添加括号）
  endOfLine: 'auto', // 行尾换行符
};
