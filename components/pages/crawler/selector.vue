<template>
<webview :src="src"></webview>
</template>

<script>
export default {
  props: [
    'src',
    'selected'
  ],
  data() {
    return {
      ids: null,
      classes: null,
      contents: null
    }
  },
  mounted() {
    const webview = document.querySelector('webview')
    const loadPage = () => {
      const css = `
        .uniqueoverset {
          z-index: 999999;
          position: fixed;
          opacity: 0.5;
          background: red;
          pointer-events: none;
        }
      `
      const script = `
        let cover = document.createElement('div')
        cover.classList.add('uniqueoverset')
        document.body.appendChild(cover)
        const parentsInfo = (node, type) => {
          const res = []
          for ( ; node; node = node.parentNode) {
            if (node !== cover) {
              if (!type) res.push(node)
              else if (node[type]) res.push(node[type])
            }
          }
          return res
        }
        window.addEventListener('mousemove', e => {
          const rect = parentsInfo(e.target)[0].getBoundingClientRect()
          cover.style.top = rect.y.toString() + 'px'
          cover.style.left = rect.x.toString() + 'px'
          cover.style.width = rect.width.toString() + 'px'
          cover.style.height = rect.height.toString() + 'px'
        })
        window.addEventListener('scroll', e => {
          cover.style.top = 0
          cover.style.left = 0
          cover.style.width = 0
          cover.style.height = 0
        })
        window.addEventListener('click', e => {
          e.preventDefault()
          console.log('ids:' + parentsInfo(e.target, 'id'))
          console.log('classes:' + parentsInfo(e.target, 'className'))
          console.log('contents:' + e.target.textContent)
        })
      `
      webview.addEventListener('console-message', (e) => {
        const msg = e.message
        const solt = m => m.replace(/^(ids||classes||contents):/, '')
        if (msg.indexOf('ids:') === 0) this.ids = solt(msg).split(',').filter(e => { return e != '' })
        if (msg.indexOf('classes:') === 0) this.classes = solt(msg).split(',').filter(e => { return e != '' })
        if (msg.indexOf('contents:') === 0) this.contents = solt(msg)
        const { ids, classes, contents } = this
        this.$emit('update:selected', {
          ids,
          classes,
          contents
        })
      })
      webview.executeJavaScript(script)
      webview.insertCSS(css)
      webview.removeEventListener('dom-ready', loadPage)
    }
    webview.addEventListener('dom-ready', loadPage)
  }
}
</script>
