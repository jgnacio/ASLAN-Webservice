"use client";

import Toolbar from "../TiptapToolbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Deshabilitar heading
        bulletList: false, // Deshabilitar bulletList
        orderedList: false, // Deshabilitar orderedList
        listItem: false, // Deshabilitar listItem
      }),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
        },
        levels: [2], // Personalización de niveles
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "ml-4",
        },
      }),
    ],
    immediatelyRender: false,
    content: content,
    editorProps: {
      attributes: {
        class:
          "rounded-b-md border-b border-r border-l min-h-[150px] border-input bg-background p-2",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
