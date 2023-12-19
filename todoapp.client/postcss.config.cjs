module.exports = {
  plugins: [
    require('postcss-import')({ /* ...options */ }),
    require('postcss-each')({ /* ...options */ }),
    require('postcss-bem-fix')({
      style: 'bem',
      separators: {
        descendent: '__'
      },
      shortcuts: {
        component: 'b',
        descendent: 'e',
        modifier: 'm'
      }
    }),
    require('postcss-nested')({ /* ...options */ }),
    //require('autoprefixer')({ /* ...options */ }),
    require('postcss-discard-comments')
  ]
};
