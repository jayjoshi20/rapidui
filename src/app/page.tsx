'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setGeneratedCode('');
    setCopied(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate component');
      }

      setGeneratedCode(data.code);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iframeSrcDoc = generatedCode
    ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          ${generatedCode}
          
          try {
             // For a simple standalone preview, we'll try to find the component name
             // This is a naive approach for the preview.
             const codeString = ${JSON.stringify(generatedCode)};
             
             // Simple regex to find the component name: const/function ComponentName
             const match = codeString.match(/(?:function|const|let|var)\\s+([A-Z][a-zA-Z0-9_]*)/);
             
             if(match && match[1]) {
                const Component = eval(match[1]);
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<Component />);
             } else {
                 document.getElementById('root').innerHTML = '<div class="text-red-500 p-4 border border-red-300 bg-red-50 rounded">Could not determine Component name to render. Expected a standard React function component structure.</div>';
             }
          } catch(e) {
             document.getElementById('root').innerHTML = '<div class="text-red-500 p-4 border border-red-300 bg-red-50 rounded">Error rendering component: ' + e.message + '</div>';
             console.error(e);
          }
        </script>
      </body>
    </html>
  `
    : '';

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="space-y-2 border-b border-neutral-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            RapidUI
          </h1>
          <p className="text-neutral-400 text-lg">AI-Driven Component Generator</p>
        </header>

        {/* Input Section */}
        <section className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-neutral-300">
              Describe your component
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the UI component you want e.g. A login form with email and password fields and a submit button"
              className="w-full h-32 p-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-neutral-100 placeholder-neutral-600 shadow-inner"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full md:w-auto px-8 py-3 bg-white text-black font-semibold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Component'
            )}
          </button>
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results Section */}
        {generatedCode && (
          <div className="grid lg:grid-cols-2 gap-8 pt-6">
            
            {/* Live Preview */}
            <section className="space-y-3 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Live Preview
                </h2>
              </div>
              <div className="flex-grow bg-white rounded-xl overflow-hidden border border-neutral-800 shadow-lg relative h-[400px] w-full">
                 <iframe
                  srcDoc={iframeSrcDoc}
                  title="Component Preview"
                  className="w-full h-full border-none"
                  style={{ height: '400px', width: '100%' }}
                  sandbox="allow-scripts"
                />
              </div>
            </section>

            {/* Code View */}
            <section className="space-y-3 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Code
                </h2>
                <button
                  onClick={handleCopyCode}
                  className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <div className="flex-grow rounded-xl overflow-hidden border border-neutral-800 bg-[#1d1f21] h-[400px] w-full">
                <SyntaxHighlighter
                  language="jsx"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    height: '100%',
                    background: 'transparent',
                    fontSize: '0.875rem',
                  }}
                  wrapLines={true}
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}
