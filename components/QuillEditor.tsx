'use client';

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'blockquote', 'code-block'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['clean'],
];

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function QuillEditor({ value, onChange, placeholder = 'Write something amazing...' }: QuillEditorProps) {
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const contentAreaRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    // Keep the latest onChange without re-initializing Quill
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Initialize Quill once; clean up DOM so the toolbar does not accumulate
    useEffect(() => {
        if (!contentAreaRef.current) return;

        // Clean any leftovers (fixes dev StrictMode double effect)
        if (editorContainerRef.current) {
            editorContainerRef.current.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
        }
        contentAreaRef.current.innerHTML = '';
        contentAreaRef.current.removeAttribute('class');

        const quill = new Quill(contentAreaRef.current, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: TOOLBAR_OPTIONS,
                },
            },
            placeholder,
        });

        quillRef.current = quill;

        quill.on('text-change', () => {
            const newContent = quill.root.innerHTML;
            onChangeRef.current?.(newContent);
        });

        return () => {
            quill.off('text-change');
            quillRef.current = null;

            // Remove the generated toolbar and reset the editor node
            if (editorContainerRef.current) {
                editorContainerRef.current.querySelectorAll('.ql-toolbar').forEach((n) => n.remove());
            }
            if (contentAreaRef.current) {
                contentAreaRef.current.innerHTML = '';
                contentAreaRef.current.removeAttribute('class');
            }
        };
        // Re-init only if placeholder changes (optional)
    }, [placeholder]);

    // Keep Quill content in sync with external value without re-initializing
    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        const current = quill.root.innerHTML;
        if (value && value !== current) {
            quill.clipboard.dangerouslyPasteHTML(value);
        } else if (!value && current !== '<p><br></p>') {
            quill.setText('');
        }
    }, [value]);

    return (
        <div className="quill-container" ref={editorContainerRef}>
            <div ref={contentAreaRef} style={{ minHeight: '250px' }} />
        </div>
    );
}

export default QuillEditor;