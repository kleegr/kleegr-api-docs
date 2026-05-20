import { marked } from 'marked'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => {
  const isExternal = href && (href.startsWith('http') || href.startsWith('//'))
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
  const titleAttr = title ? ` title="${title}"` : ''
  return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`
}
marked.setOptions({ renderer, gfm: true, breaks: false })

export default function MarkdownContent({ content }) {
  const html = marked.parse(content || '')
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
