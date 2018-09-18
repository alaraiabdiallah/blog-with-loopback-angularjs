'use strict';

module.exports = function(app) {
  var ds = app.dataSources.MySQL;
  var lbTables = [
    'User',
    'AccessToken',
    'ACL',
    'RoleMapping',
    'Role',
    'Category',
    'Comment',
    'PostCategory',
    'Post'];
  ds.autoupdate(lbTables, function(er) {
    if (er) throw er;
    console.log('Loopback tables created in ' + ds.adapter.name);
  });
};
