import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "../../../components/ui/rich-text-editor";

function BoardEditor({ content, setContent }) {

    const editor = useEditor({
        extensions: [StarterKit],
        content: content || '',
        shouldRerenderOnTransaction: true,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && content !== undefined && content !== null && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;
    return (
        <RichTextEditor.Root
            editor={editor}
            border="1px solid"
            borderColor="border"
            rounded="md"
            minH="500px"
            css={{ "--content-min-height": "500px" }}
            onClick={(e) => {
                if (e.target.closest('.ProseMirror')) return;
                editor?.commands.focus('end');
            }}
        >
            <RichTextEditor.Content />
        </RichTextEditor.Root>
    )
}

export default BoardEditor;