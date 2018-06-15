const moduleAlias = require('module-alias');

const basePath = (el: string): string => __dirname + '/' + el;


moduleAlias.addAliases({
  'src': basePath('src'),
});
