const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function briefPreview(prompt, lang = 'zh') {
  const zh = lang !== 'en';
  return `<div class="brief-help"><p>${zh
    ? '适用于 Codex、Claude Code、Cursor 等代码智能体。直接粘贴这份指令，并附上你的 CSV / JSON 数据和修改要求；尚未配置时，指令会引导智能体先准备 DataMagic 仓库和 Skill。'
    : 'Use with Codex, Claude Code, Cursor, or another coding agent. Paste this brief with your CSV / JSON data and requested changes; it includes repository and Skill setup guidance for first use.'}</p></div>
    <details class="brief-preview"><summary>${zh ? '查看将复制的完整实现指令' : 'Preview the complete implementation brief'}</summary>
    <textarea readonly spellcheck="false" aria-label="${zh ? '完整实现指令' : 'Complete implementation brief'}">${escapeHtml(prompt)}</textarea></details>`;
}
