const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function briefPreview(prompt, lang = 'zh') {
  const zh = lang !== 'en';
  return `<div class="brief-help"><p>${zh
    ? '适用于 Codex、Claude Code、Cursor 等代码智能体。先在智能体中打开 DataMagic 仓库，再粘贴这份指令，并附上你的 CSV / JSON 数据和修改要求。'
    : 'Use with Codex, Claude Code, Cursor, or another coding agent. Open the DataMagic repository in your agent, paste this brief, and attach your CSV / JSON data and requested changes.'}</p></div>
    <details class="brief-preview"><summary>${zh ? '查看将复制的完整实现指令' : 'Preview the complete implementation brief'}</summary>
    <textarea readonly spellcheck="false" aria-label="${zh ? '完整实现指令' : 'Complete implementation brief'}">${escapeHtml(prompt)}</textarea></details>`;
}
