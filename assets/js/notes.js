document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'notes';

  const textarea = document.getElementById('new-note-content');
  const saveBtn = document.getElementById('save-note-btn');
  const notesContainer = document.getElementById('notes-container');

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr;
    } catch (e) {
      console.error('Failed to parse notes from localStorage', e);
      return [];
    }
  }

  function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function formatTs(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString('ko-KR', { hour12: false });
    } catch {
      return iso;
    }
  }

  function renderNotes() {
    const notes = loadNotes().sort((a, b) => (b.timestamp > a.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0));

    if (notes.length === 0) {
      notesContainer.innerHTML = '<div class="no-notes">저장된 메모가 없습니다.</div>';
      return;
    }

    notesContainer.innerHTML = notes.map(n => `
      <article class="note-card" data-id="${n.id}">
        <div class="note-content">${escapeHtml(n.content).replace(/\n/g, '<br>')}</div>
        <footer class="note-meta">
          <time class="note-timestamp" datetime="${n.timestamp}">${formatTs(n.timestamp)}</time>
          <button class="delete-note-btn" title="메모 삭제" aria-label="메모 삭제">×</button>
        </footer>
      </article>
    `).join('');
  }

  function addNote(content) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const newNote = {
      id: Date.now(),
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    const notes = loadNotes();
    // 최신순 상단 노출을 위해 앞에 추가
    notes.unshift(newNote);
    saveNotes(notes);
    renderNotes();
  }

  function deleteNote(id) {
    const notes = loadNotes().filter(n => String(n.id) !== String(id));
    saveNotes(notes);
    renderNotes();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Event bindings
  saveBtn.addEventListener('click', () => {
    addNote(textarea.value);
    textarea.value = '';
    textarea.focus();
  });

  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      addNote(textarea.value);
      textarea.value = '';
    }
  });

  notesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-note-btn')) {
      const card = e.target.closest('.note-card');
      if (!card) return;
      const id = card.getAttribute('data-id');
      deleteNote(id);
    }
  });

  // Initial render
  renderNotes();
});
