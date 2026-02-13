import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import DynamicIcon from '@/Components/DynamicIcon';

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="w-px h-5 bg-border mx-1" />;
}

function Toolbar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Negrita"
      >
        <DynamicIcon name="Bold" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Cursiva"
      >
        <DynamicIcon name="Italic" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Tachado"
      >
        <DynamicIcon name="Strikethrough" className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Encabezado 2"
      >
        <span className="font-bold text-xs">H2</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Encabezado 3"
      >
        <span className="font-bold text-xs">H3</span>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Lista con viñetas"
      >
        <DynamicIcon name="List" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Lista numerada"
      >
        <DynamicIcon name="ListOrdered" className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Cita"
      >
        <DynamicIcon name="Quote" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Enlace"
      >
        <DynamicIcon name="Link" className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Línea horizontal"
      >
        <DynamicIcon name="Minus" className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(name, editor.getHTML());
    },
  });

  const id = `field-${name}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={cn(
          "rounded-md border border-input bg-background overflow-hidden",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background",
          error && "border-red-500 focus-within:ring-red-500"
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          id={id}
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none px-3 py-2 min-h-[200px]",
            "[&_.tiptap]:outline-none [&_.tiptap]:min-h-[180px]",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <DynamicIcon name="AlertCircle" className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
