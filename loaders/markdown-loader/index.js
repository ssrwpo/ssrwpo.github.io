import frontMatter from 'front-matter'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
import objectAssign from 'object-assign'
import decode from 'decode-html';

// For compiling the result of markdown-it-jsx
import * as babel from 'babel-core'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import * as components from '../../components'
Object.assign(global, components, { React })

function jsxify(str) {

  // We have a string that looks like this:
  //
  // foo<span>bar</span>foo<span>bar</span>foo
  //
  // We need:
  //
  // <div>{'foo'}<span>{'bar'}</span>{'foo'}<span>{'bar'}</span>{'foo'}</div>

  const wrapped = `<div>${str}</div>`;
  const jsxified = wrapped.replace(/(<[^>]*>)([\S\s]*?)(?=<[^>]*>)/g, '$1{`$2`}');

  // The code has already had non-html characters converted to entities, but this
  // these strings are now inside the react components, we need to decode them

  return decode(jsxified);
}

var highlight = function (str, lang) {

  // Since the markdown is passed through markdown-it-jsx, the
  // blocks will be between {` ... `}
  const codeStr = str.substring(2, str.length - 2);

  // We highlight the code block and return a JSXified version...
  if ((lang !== null) && hljs.getLanguage(lang)) {
    try {
      return jsxify(hljs.highlight(lang, codeStr).value)
    } catch (_error) {
      console.error(_error)
    }
  }
  try {
    return jsxify(hljs.highlightAuto(codeStr).value)
  } catch (_error) {
    console.error(_error)
  }
  return ''
}

var md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight,
})
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-attrs'))
  .use(require("markdown-it-jsx"))

module.exports = function (content) {
  this.cacheable()
  const meta = frontMatter(content)
  let body = md.render(meta.body)

  // Since the markdown is passed through markdown-it-jsx, what we have
  // back is now a React component string that we need to render...

  var babelCompileResult = babel.transform(
    // We need to wrap the JSX in a div so it's a valid JSX expression.
    '() => (<div>' + body + '</div>)',
    { presets: ['react'] }
  ).code;

  const Document = eval(babelCompileResult);
  body = ReactDOMServer.renderToStaticMarkup(React.createElement(Document));

  const result = objectAssign({}, meta.attributes, {
    body,
  })
  this.value = result
  return `module.exports = ${JSON.stringify(result)}`
}
