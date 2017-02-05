const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(
  path.join(__dirname, 'public'),
  { dotfiles: true },
  err => console.log('Deployment errors:', err.toString())
);
