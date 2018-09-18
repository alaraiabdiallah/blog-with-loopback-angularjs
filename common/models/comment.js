'use strict';

module.exports = function(Model) {
  Model.observe('before save', function filterProperties(ctx, next) {
    if (ctx.isNewInstance) {
      ctx.instance.createdAt = new Date();
      ctx.instance.modifiedAt = new Date();
    } else {
      ctx.data.modifiedAt = new Date();
    }
    next();
  });
};
