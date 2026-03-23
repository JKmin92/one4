import Image from "@tiptap/extension-image";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Control, RichTextEditor, useRichTextEditorContext } from "../../../../components/ui/rich-text-editor";
import { Box, Button, Dialog, FileUpload, Icon } from "@chakra-ui/react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { LuGripVertical, LuImage, LuUpload } from "react-icons/lu";
import { useEffect, useState } from "react";

function RegisterEditor({ content, setContent }) {
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: content,
        shouldRerenderOnTransaction: true,
        immediatelyRender: false,
        onBlur({ editor }) {
            setContent(editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && content && !editor.isFocused && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <>
            <RichTextEditor.Root editor={editor} w="full" minH="500px" overflow="auto" fontSize="sm">
                <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlGroup>
                        <InsertImageControl />
                    </RichTextEditor.ControlGroup>
                </RichTextEditor.Toolbar>
                <Box 
                    position="relative" 
                    flex="1" 
                    display="flex" 
                    flexDirection="column"
                    onClick={() => editor.chain().focus().run()}
                    cursor="text"
                >
                    <DragHandle editor={editor}>
                        <Box
                            pos="relative"
                            top="-0.5"
                            insetStart="-1"
                            cursor="grab"
                            color="fg.muted"
                            opacity="0.6"
                            _hover={{ opacity: 1, color: "fg" }}
                            _active={{ cursor: "grabbing" }}
                            onClick={(e) => e.stopPropagation()} // 드래그 핸들 클릭 시 에디터 포커스 방지
                        >
                            <Icon asChild boxSize="4">
                                <LuGripVertical />
                            </Icon>
                        </Box>
                    </DragHandle>
                    <Box flex="1" h="full">
                        <RichTextEditor.Content />
                    </Box>
                </Box>
            </RichTextEditor.Root>

        </>
    )
}

function InsertImageControl() {
    const { editor } = useRichTextEditorContext();
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);

    if (!editor) return null;

    return (
        <>
            <Control.ButtonControl
                icon={<LuImage />}
                label="Insert Image"
                onClick={() => setOpen(true)}
                variant="ghost"
            />

            <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>이미지 추가</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <FileUpload.Root
                                maxW="xl"
                                alignItems="stretch"
                                maxFiles={1}
                                accept="image/*"
                                onFileAccept={(accepted) => {
                                    const uploaded = accepted.files ?? []
                                    setFiles(uploaded);

                                    if (uploaded[0]) {
                                        const url = URL.createObjectURL(uploaded[0]);
                                        editor.chain().focus().setImage({ src: url }).run();
                                        setOpen(false)
                                    }
                                }}
                            >
                                <FileUpload.HiddenInput />
                                <FileUpload.Dropzone>
                                    <Icon size="md" color="fg.muted"><LuUpload /></Icon>
                                    <FileUpload.DropzoneContent>
                                        <Box>Drag and drop a file here</Box>
                                        <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                                    </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>

                                <FileUpload.List files={files} />

                            </FileUpload.Root>
                        </Dialog.Body>
                        <Dialog.Footer mt="4">
                            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}

export default RegisterEditor;