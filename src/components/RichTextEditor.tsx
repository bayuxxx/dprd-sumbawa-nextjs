'use client';
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Minus,
    AlignLeft, AlignCenter, AlignRight,
    Heading2, Heading3, Link2, Undo, Redo,
} from 'lucide-react';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const ToolbarBtn = ({
    onClick, active, title, children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onMouseDown={e => { e.preventDefault(); onClick(); }}
        title={title}
        className={`p-1.5 rounded transition-colors ${active
            ? 'bg-[#0a2744] text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: placeholder ?? 'Tulis konten berita di sini...' }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[240px] px-4 py-3 focus:outline-none',
            },
        },
    });

    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt('URL:', editor.getAttributes('link').href ?? 'https://');
        if (url === null) return;
        if (url === '') { editor.chain().focus().unsetLink().run(); return; }
        editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough size={15} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    <Heading3 size={15} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Rata kiri">
                    <AlignLeft size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Tengah">
                    <AlignCenter size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Rata kanan">
                    <AlignRight size={15} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                    <List size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                    <ListOrdered size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <Quote size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Garis pemisah">
                    <Minus size={15} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Tambah link">
                    <Link2 size={15} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
                    <Undo size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
                    <Redo size={15} />
                </ToolbarBtn>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />
        </div>
    );
}
