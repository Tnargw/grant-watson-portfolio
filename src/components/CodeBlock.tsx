import { useMemo } from 'react';

type Props = {
  language: string;
  caption: string;
  source: string;
};

const KEYWORDS: Record<string, string[]> = {
  sql: [
    'create',
    'table',
    'policy',
    'on',
    'as',
    'permissive',
    'for',
    'insert',
    'select',
    'update',
    'delete',
    'to',
    'with',
    'check',
    'exists',
    'from',
    'where',
    'and',
    'or',
    'not',
    'null',
    'default',
    'primary',
    'key',
    'foreign',
    'references',
    'unique',
    'if',
    'auto_increment',
    'int',
    'char',
    'varchar',
    'tinyint',
    'authenticated',
  ],
  javascript: [
    'const',
    'let',
    'var',
    'function',
    'async',
    'await',
    'return',
    'import',
    'export',
    'from',
    'new',
    'class',
    'if',
    'else',
    'for',
    'of',
    'in',
    'true',
    'false',
    'null',
    'undefined',
  ],
};

type Token = { text: string; kind: 'keyword' | 'string' | 'comment' | 'number' | 'plain' };

/**
 * A deliberately small highlighter.
 *
 * Pulling in a full syntax-highlighting library to color two excerpts would
 * add far more bytes than the excerpts themselves. This splits on the four
 * things that actually aid reading — comments, strings, numbers, keywords —
 * and leaves everything else alone.
 */
function tokenize(source: string, language: string): Token[] {
  const keywords = new Set(KEYWORDS[language] ?? []);
  // Order matters: comments and strings are matched before words, so a keyword
  // inside a string stays a string.
  const pattern = /(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|(\w+)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ text: source.slice(lastIndex, index), kind: 'plain' });

    const [full, comment, str, num, word] = match;
    if (comment) tokens.push({ text: full, kind: 'comment' });
    else if (str) tokens.push({ text: full, kind: 'string' });
    else if (num) tokens.push({ text: full, kind: 'number' });
    else if (word && keywords.has(word.toLowerCase()))
      tokens.push({ text: full, kind: 'keyword' });
    else tokens.push({ text: full, kind: 'plain' });

    lastIndex = index + full.length;
  }

  if (lastIndex < source.length) tokens.push({ text: source.slice(lastIndex), kind: 'plain' });
  return tokens;
}

export function CodeBlock({ language, caption, source }: Props) {
  const tokens = useMemo(() => tokenize(source, language), [source, language]);

  return (
    <figure className="code">
      <figcaption className="code__caption">
        <span className="code__lang">{language}</span>
        <span>{caption}</span>
      </figcaption>
      <pre>
        <code>
          {tokens.map((token, i) =>
            token.kind === 'plain' ? (
              token.text
            ) : (
              <span key={i} className={`tok-${token.kind}`}>
                {token.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}
