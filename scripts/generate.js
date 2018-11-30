/**
 * Generate static pages
 */

const fs = require('fs-extra')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const { directive } = require('vue-i18n-extensions')

const templatePath = path.join(__dirname, '../src/template.html')

const bundle = require('../dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync(templatePath, 'utf-8')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(bundle, {
  template,
  clientManifest,
  runInNewContext: false,
  directives: {
    t: directive
  }
})

const routes = [
  {
    title: 'CRIMX',
    url: '/'
  },
  {
    title: 'CRIMX Projects',
    url: '/projects'
  },
  {
    title: 'CRIMX Projects',
    url: '/projects/zh-CN'
  },
  {
    title: 'CRIMX Projects',
    url: '/projects/en-US'
  }
]

routes.forEach(async context => {
  const html = await renderer.renderToString(context)
  let filename = context.url.replace(/\/$/, '/index.html').replace(/^\//, '')
  if (!filename.endsWith('.html')) {
    filename += '.html'
  }
  await fs.outputFile(path.join(__dirname, '../dist/', filename), html)
})
