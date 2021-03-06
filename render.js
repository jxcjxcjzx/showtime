// pure render function
var h = require('virtual-dom/h')
var css = require('./styles')

module.exports = function (state) {
  var slide = state.get('slides')[state.get('current')]
  if (!slide) { slide = state.get('slides')[0] }

  var incode = false
  var code = []

  // animation
  var animate = state.get('transition') ? 'animated slideOutLeft' : 'animated slideInRight'
  if (state.get('direction') === 'left') {
    animate = state.get('transition') ? 'animated slideOutRight' : 'animated slideInLeft'
  }

  return h('div', { className: animate, style: { 'min-height': '100%' } }, slide.split('\n').map(function (l) {
      if (/^###/.test(l)) {
        return h('h3', { style: css.h3 }, l.replace('###', ''))
      }

      if (/^##/.test(l)) {
        return h('h2', { style: css.h2 }, l.replace('## ', ''))
      }

      if (/^#/.test(l)) {
        return h('h1', { style: css.h1 }, l.replace('# ', ''))
        // return h('svg', [
        //   h('text', 'Hello World')
        // ])
        // return h('div', { style: css.aligner }, [
        //   h('div', { style: css.alignerItem }, [
        //     h('h1', l.replace('# ', ''))
        //   ])
        // ])
      }

      if (/^!/.test(l)) {
        return h('div', { style: {
          position: 'absolute',
          height: '800px',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: 'url("'+  l.replace('! ', '') + '") center / cover'
        }})
        //return h('img', { style: css.img, src: l.replace('! ', '') })

        // return h('div', { style: css.horizontal }, [
        //   h('div', { style: css.vertical }, [
        //     h('img', { style: css.img, src: l.replace('! ', '') })
        //   ])
        // ])
      }

      if (/^\*/.test(l)) {
        return h('p', { style: css.bullet }, l.replace('*', '-'))
      }

      if (!incode && /^```/.test(l)) {
        incode = true
        code = []
        return
      }

      if (incode && /^```/.test(l)) {
        incode = false
        return h('pre', { style: { 'margin-left': '200px', 'margin-top': '20px' }}, [
          h('code', { style: css.codeCss }, code.join('\n'))
        ])
      }

      if (incode) {
        code.push(l)
        return
      }

      if (/^link/.test(l)) {
        return h('p', {style: css.p}, [
          h('a', { href: l.replace('link ',''), target: '_blank'}, '[Click Here]')
        ])
      }

      if (l.trim().length > 0) {
        return h('p', {style: css.p}, l)
      }
      return null; //h('p', {style: css.p}, l)
    })
  )
}
