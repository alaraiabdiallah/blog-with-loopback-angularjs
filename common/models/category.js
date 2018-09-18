'use strict';

module.exports = function(Model) {
  var slugFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  Model.observe('before save', function filterProperties(ctx, next) {
    if (ctx.isNewInstance) {
      ctx.instance.createdAt = new Date();
      ctx.instance.modifiedAt = new Date();
    } else {
      ctx.data.modifiedAt = new Date();
    }
    next();
  });

  Model.validatesFormatOf('slug', {
    with: slugFormat, message: 'Slug format not valid.',
  });
  Model.validateAsync('slug', slugExist, {message: 'Slug already used.'});

  function slugExist(err, done) {
    Model.findOne({
      where: {slug: this.slug},
    }).then((res) => {
      let checkMethod1 = (this.id == undefined) && (res != null);
      if (checkMethod1) err();
      if (checkMethod1 && (res.id != this.id))err();

      done();
    });
  }
};
