import React from 'react'

// Helper: parse basic inline bold and inline code
export function renderInlineFormatted(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  // Regex matches **bold**, `code`, or *italic*
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={keyIdx++} style={{ color: '#fff' }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code 
          key={keyIdx++} 
          style={{ 
            background: 'rgba(34, 211, 238, 0.1)', 
            color: 'var(--cyan)', 
            padding: '2px 6px', 
            borderRadius: '4px', 
            fontSize: '13px',
            fontFamily: 'monospace'
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={keyIdx++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length ? parts : text;
}

// Helper: parse Markdown sections with tables, blockquotes, headings, lists
export default function ArticleContentRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect Markdown Table (line starts and ends with |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
        const bodyRows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

        elements.push(
          <div key={`table-${i}`} className="help-article-table-wrapper">
            <table className="help-article-table">
              <thead>
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx}>{renderInlineFormatted(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((r, rIdx) => (
                  <tr key={rIdx}>
                    {r.map((cell, cIdx) => (
                      <td key={cIdx}>{renderInlineFormatted(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Callout box (> blockquote)
    if (line.trim().startsWith('>')) {
      const calloutText = line.trim().replace(/^>\s*/, '');
      elements.push(
        <div key={`callout-${i}`} className="help-callout-box">
          {renderInlineFormatted(calloutText)}
        </div>
      );
      i++;
      continue;
    }

    // Subheadings
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${i}`} style={{ color: 'var(--cyan)', fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>
          {renderInlineFormatted(line.replace('### ', ''))}
        </h4>
      );
      i++;
      continue;
    }

    // Bullet points
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const rawBullet = line.trim().substring(2);
      const isChecklist = /^\[\s*\]\s*/.test(rawBullet);
      const bulletText = rawBullet.replace(/^\[\s*\]\s*/, '');
      elements.push(
        <div key={`bullet-${i}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingLeft: '8px' }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{isChecklist ? '☐' : '•'}</span>
          <div style={{ flex: 1 }}>{renderInlineFormatted(bulletText)}</div>
        </div>
      );
      i++;
      continue;
    }

    // Numbered lists
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingLeft: '8px' }}>
          <span style={{ color: 'var(--purple)', fontWeight: 'bold', minWidth: '18px' }}>{numMatch[1]}.</span>
          <div style={{ flex: 1 }}>{renderInlineFormatted(numMatch[2])}</div>
        </div>
      );
      i++;
      continue;
    }

    // Standard paragraph or empty line
    if (line.trim()) {
      elements.push(
        <p key={`p-${i}`} style={{ marginBottom: '14px', lineHeight: '1.7' }}>
          {renderInlineFormatted(line)}
        </p>
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}
