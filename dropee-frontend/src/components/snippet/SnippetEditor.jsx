import React from 'react';

const LANGUAGES = [
  'Plain Text', 'JavaScript', 'TypeScript', 'Python', 'HTML',
  'CSS', 'JSON', 'Bash', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'Markdown',
];

const SnippetEditor = ({ title, setTitle, text, setText, language, setLanguage }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">
          Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., React useEffect hook example"
          className="input-field"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input-field"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">
          Code / Text <span className="text-error">*</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your code or text here..."
          rows={16}
          className="input-field font-mono text-sm resize-y min-h-[240px]"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default SnippetEditor;
