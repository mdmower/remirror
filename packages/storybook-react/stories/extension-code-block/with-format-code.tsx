import 'remirror/styles/all.css';

import React from 'react';
import css from 'refractor/lang/css.js';
import json from 'refractor/lang/json.js';
import markdown from 'refractor/lang/markdown.js';
import typescript from 'refractor/lang/typescript.js';
import { CodeBlockExtension, TrailingNodeExtension } from 'remirror/extensions';
import { formatter } from '@remirror/extension-code-block/formatter';
import { Remirror, ThemeProvider, useRemirror } from '@remirror/react';
import { CodeBlockFormatCode } from '@remirror/react-ui';

const extensions = () => [
  new CodeBlockExtension({
    supportedLanguages: [css, json, markdown, typescript],
    formatter,
  }),
  new TrailingNodeExtension(),
];

const content = `
<pre><code data-code-block-language="typescript">function
  sayHello(   )
   {
console.log('Hello world, TypeScript!')
            }</code></pre>
<pre><code data-code-block-language="markdown">**Markdown**
-   Hello
- _world_
</code></pre>
<pre><code data-code-block-language="css">.hello-world-css{color:red;}</code></pre>
<pre><code data-code-block-language="json">{
"JSON":true,"hello":"world"}</code></pre>
`;

const WithFormatCode = (): JSX.Element => {
  const { manager, state } = useRemirror({ extensions, content, stringHandler: 'html' });

  return (
    <ThemeProvider>
      <Remirror manager={manager} initialContent={state} autoRender>
        <CodeBlockFormatCode />
      </Remirror>
    </ThemeProvider>
  );
};

export default WithFormatCode;
