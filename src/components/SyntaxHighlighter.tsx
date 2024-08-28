"use client";

import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface SyntaxHighlighterProps {
	language: string;
	code: string;
}

export default function SyntaxHighlighter({
	language,
	code,
}: SyntaxHighlighterProps) {
	useEffect(() => {
		hljs.highlightAll();
	}, []);
	return (
		<pre className="rounded-lg text-sm overflow-x-auto font-mono">
			<code className={`language-${language}`}>{code}</code>
		</pre>
	);
}
