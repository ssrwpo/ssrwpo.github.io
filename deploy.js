const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(
  path.join(__dirname, 'public'),
  { dotfiles: true, branch: 'master' },
  err => console.log('deployment error:', err.toString())
);
