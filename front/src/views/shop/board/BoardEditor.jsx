import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "../../../components/ui/rich-text-editor";

function BoardEditor({ content, setContent }) {

    const editor = useEditor({
        extensions: [StarterKit],
        content,
        shouldRerenderOnTransaction: true,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        }
    });

    if (!editor) return null;
    return (
        <RichTextEditor.Root
            editor={editor}
            border="1px solid"
            borderColor="border"
            rounded="md"
            minH="500px"
        >
            <RichTextEditor.Content />
        </RichTextEditor.Root>
    )
}

export default BoardEditor;