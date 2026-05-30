/**
 * Simple Markdown → HTML renderer for journal articles.
 * No external dependencies — keeps bundle small.
 * Supports: headings, paragraphs, bold, italic, links, lists, tables, code blocks.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function processInline(text: string): string {
  let result = escapeHtml(text)
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code>$1</code>')
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green-600 hover:underline" target="_blank" rel="noopener">$1</a>')
  return result
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.split('\n')
  const html: string[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let inTable = false
  let tableRows: string[] = []
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'
  let listItems: string[] = []

  function flushList() {
    if (inList && listItems.length > 0) {
      const tag = listType
      html.push(`<${tag} class="list-${listType === 'ul' ? 'disc' : 'decimal'} pl-6 mb-4 space-y-1">`)
      listItems.forEach((item) => html.push(`<li>${processInline(item)}</li>`))
      html.push(`</${tag}>`)
      listItems = []
      inList = false
    }
  }

  function flushTable() {
    if (inTable && tableRows.length > 0) {
      html.push('<div class="overflow-x-auto mb-6"><table class="min-w-full border-collapse border border-gray-300">')
      tableRows.forEach((row, idx) => {
        // Skip separator row
        if (/^\|[\s-:|]+\|$/.test(row)) return
        const cells = row.split('|').filter((c) => c.trim() !== '')
        const tag = idx === 0 ? 'th' : 'td'
        const rowClass = idx === 0
          ? 'bg-gray-100 font-semibold'
          : idx % 2 === 0 ? 'bg-gray-50' : ''
        html.push(`<tr class="${rowClass}">`)
        cells.forEach((cell) => {
          html.push(`<${tag} class="border border-gray-300 px-4 py-2 text-sm">${processInline(cell.trim())}</${tag}>`)
        })
        html.push('</tr>')
      })
      html.push('</table></div>')
      tableRows = []
      inTable = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto text-sm"><code>${codeContent.join('\n')}</code></pre>`)
        codeContent = []
        inCodeBlock = false
      } else {
        flushList()
        flushTable()
        inCodeBlock = true
      }
      continue
    }
    if (inCodeBlock) {
      codeContent.push(escapeHtml(line))
      continue
    }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList()
      if (!inTable) inTable = true
      tableRows.push(line.trim())
      continue
    } else {
      flushTable()
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      flushTable()
      if (!inList || listType !== 'ul') {
        flushList()
        inList = true
        listType = 'ul'
      }
      listItems.push(line.trim().replace(/^[-*]\s/, ''))
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      flushTable()
      if (!inList || listType !== 'ol') {
        flushList()
        inList = true
        listType = 'ol'
      }
      listItems.push(line.trim().replace(/^\d+\.\s/, ''))
      continue
    }

    // Not in a list — flush
    flushList()

    // Headings
    if (line.startsWith('### ')) {
      html.push(`<h3 class="text-lg font-bold mt-6 mb-3 text-gray-800">${processInline(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      html.push(`<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">${processInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      html.push(`<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">${processInline(line.slice(2))}</h1>`)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      continue
    }

    // Paragraph
    html.push(`<p class="mb-4 text-gray-700 leading-relaxed">${processInline(line)}</p>`)
  }

  flushList()
  flushTable()

  return html.join('\n')
}
