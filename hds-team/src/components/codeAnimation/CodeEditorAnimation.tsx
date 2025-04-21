"use client"

import React, { useRef } from 'react';
import WindowHeader from './code-editor/WindowHeader';
import CodeEditorView from './code-editor/CodeEditorView';
import WebsitePreview from './code-editor/WebsitePreview';
import { useCodeAnimation } from './code-editor/useCodeAnimation';

const codeSnippets = [
    "import React from 'react';",
    "import { Button } from './components/ui/button';",
    "",
    "const App = () => {",
    "  const [count, setCount] = useState(0);",
    "",
    "  const handleIncrement = () => {",
    "    setCount(prevCount => prevCount + 1);",
    "  };",
    "",
    "  return (",
    "    <div className=\"container\">",
    "      <h1>Интерактивно приложение</h1>",
    "      <p>Текущ брой: {count}</p>",
    "      <Button onClick={handleIncrement}>",
    "        Увеличи",
    "      </Button>",
    "    </div>",
    "  );",
    "};",
    "",
    "export default App;"
];

const CodeEditorAnimation = () => {
    // Create the ref in the component
    const containerRef = useRef<HTMLDivElement>(null);

    // Pass the ref to the hook
    const { lines, currentLine, currentChar, showWebsite } = useCodeAnimation(codeSnippets, containerRef);

    return (
        <div className="w-full animate-slide-in-right transform hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: '0.5s' }}>
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 hover:shadow-blue-500/30 transition-all duration-500">
                <WindowHeader fileName="App.tsx" />

                {!showWebsite ? (
                    <CodeEditorView
                        lines={lines}
                        currentLine={currentLine}
                        currentChar={currentChar}
                        codeSnippets={codeSnippets}
                        containerRef={containerRef}
                    />
                ) : (
                    <WebsitePreview />
                )}
            </div>
        </div>
    );
};

export default CodeEditorAnimation;