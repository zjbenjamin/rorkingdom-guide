const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')
const XLSX = require('xlsx')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function parseXmlTable(xml) {
  const rows = []
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi
  let match
  while ((match = trRegex.exec(xml)) !== null) {
    const cells = []
    let tdMatch
    while ((tdMatch = tdRegex.exec(match[1])) !== null) {
      cells.push(tdMatch[1].replace(/<[^>]+>/g, '').trim())
    }
    if (cells.length > 0) rows.push(cells)
  }
  return rows
}

function parseXmlText(xml) {
  let text = xml
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n')
  text = text.replace(/<\/div>/gi, '\n')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/\n{3,}/g, '\n\n')
  return text.trim()
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    mod.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

function parseDocx(buffer) {
  const AdmZip = require('adm-zip')
  const zip = new AdmZip(buffer)
  const xmlEntry = zip.getEntry('word/document.xml')
  if (!xmlEntry) return ''
  const xml = xmlEntry.getData().toString('utf8')
  return parseXmlText(xml)
}

exports.main = async (event, context) => {
  const { fileID, url, fileType } = event
  try {
    let buffer
    if (fileID) {
      const res = await cloud.downloadFile({ fileID })
      buffer = res.fileContent
    } else if (url) {
      buffer = await fetchUrl(url)
    } else {
      return { success: false, error: '未提供文件' }
    }
    const ext = (fileType || '').toLowerCase()
    const fileName = fileID || url || ''
    if (ext === 'xml' || fileName.endsWith('.xml')) {
      const xml = buffer.toString('utf8')
      const table = parseXmlTable(xml)
      if (table.length > 0) {
        let md = ''
        for (let i = 0; i < table.length; i++) {
          md += '| ' + table[i].join(' | ') + ' |\n'
          if (i === 0) md += '| ' + table[i].map(() => '---').join(' | ') + ' |\n'
        }
        return { success: true, content: md, type: 'table' }
      }
      return { success: true, content: parseXmlText(xml), type: 'text' }
    }
    if (ext === 'xlsx' || ext === 'xls' || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      if (jsonData.length > 0) {
        let md = ''
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i].map(cell => cell !== undefined && cell !== null ? String(cell) : '')
          md += '| ' + row.join(' | ') + ' |\n'
          if (i === 0) md += '| ' + row.map(() => '---').join(' | ') + ' |\n'
        }
        return { success: true, content: md, type: 'table' }
      }
      return { success: true, content: '', type: 'empty' }
    }
    if (ext === 'docx' || fileName.endsWith('.docx')) {
      const text = parseDocx(buffer)
      return { success: true, content: text, type: 'text' }
    }
    if (ext === 'doc' || fileName.endsWith('.doc')) {
      return { success: false, error: '暂不支持DOC格式，请转换为DOCX后重试' }
    }
    return { success: false, error: '不支持的文件格式' }
  } catch (e) {
    return { success: false, error: e.message || '解析失败' }
  }
}
