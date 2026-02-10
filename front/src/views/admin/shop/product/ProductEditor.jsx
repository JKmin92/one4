import { useEditor } from "@tiptap/react";
import { RichTextEditor, Control, useRichTextEditorContext } from "../../../../components/ui/rich-text-editor";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useState, useEffect } from "react";
import { Box, Button, Dialog, FileUpload, Icon, Input, Tabs } from "@chakra-ui/react";
import { LuGripVertical, LuImage, LuLink, LuUpload } from "react-icons/lu";
import DragHandle from "@tiptap/extension-drag-handle-react";

function InsertImageControl() {
    const { editor } = useRichTextEditorContext();
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);

    if (!editor) return null;

    return (
        <>
            <Control.ButtonControl
                icon={<LuImage />}
                onClick={() => setOpen(true)}
                variant="ghost"
            />

            <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="lg">
                        <Dialog.Header>
                            <Dialog.Title>이미지 삽입</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Tabs.Root defaultValue="url">
                                <Tabs.List>
                                    <Tabs.Trigger value="url"><LuLink /> Embed URL</Tabs.Trigger>
                                    <Tabs.Trigger value="upload"><LuUpload /> Upload File</Tabs.Trigger>
                                </Tabs.List>

                                <Tabs.Content value="url">
                                    <Box display="flex" gap="2" mt="4">
                                        <Input placeholder="이미지 URL을 입력해주세요." id="image-url-input" />
                                        <Button
                                            onClick={() => {
                                                const url = document.getElementById("image-url-input").value;
                                                if (url) editor.chain().focus().setImage({ src: url }).run();
                                                setOpen(false);
                                            }}
                                        >
                                            삽입
                                        </Button>
                                    </Box>
                                </Tabs.Content>

                                <Tabs.Content value="upload">
                                    <FileUpload.Root
                                        maxW="xl"
                                        alignItems="stretch"
                                        maxFiles={1}
                                        accept="image/*"
                                        onFileAccept={(accepted) => {
                                            const uploaded = accepted.files ?? []
                                            setFiles(uploaded)

                                            if (uploaded[0]) {
                                                const url = URL.createObjectURL(uploaded[0])
                                                editor.chain().focus().setImage({ src: url }).run()
                                                setOpen(false)
                                            }
                                        }}
                                    >
                                        <FileUpload.HiddenInput />
                                        <FileUpload.Dropzone>
                                            <Icon size="md" color="fg.muted">
                                                <LuUpload />
                                            </Icon>
                                            <FileUpload.DropzoneContent>
                                                <Box>Drag and drop a file here</Box>
                                                <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                                            </FileUpload.DropzoneContent>
                                        </FileUpload.Dropzone>

                                        <FileUpload.List files={files} />
                                    </FileUpload.Root>
                                </Tabs.Content>
                            </Tabs.Root>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}

function ProductEditor({ content, setContent }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
                underline: false,
                strike: false,
                code: false,
                codeBlock: false,
            }),
            Subscript,
            Superscript,
            TextAlign.configure({ types: ["paragraph", "heading"] }),
            Image,
            Placeholder.configure({
                placeholder: "여기에 내용을 입력해주세요.",
            }),
        ],
        content: content,
        shouldRerenderOnTransaction: true,
        immediatelyRender: false,
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        }
    })

    useEffect(() => {
        if (editor && content && !editor.isFocused && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <RichTextEditor.Root editor={editor} w="full" h="500px" overflow="auto">
            <RichTextEditor.Toolbar variant="sticky" roundedTop="l2" borderBottomWidth="1px">
                <RichTextEditor.ControlGroup>
                    <Control.Bold />
                    <Control.Italic />
                    <Control.Underline />
                    <Control.Strikethrough />
                    <Control.Code />
                    <Control.Subscript />
                    <Control.Superscript />
                    <Control.AlignLeft />
                    <Control.AlignCenter />
                    <Control.AlignRight />
                </RichTextEditor.ControlGroup>
                <RichTextEditor.ControlGroup>
                    <Control.H1 />
                    <Control.H2 />
                    <Control.H3 />
                    <Control.H4 />
                </RichTextEditor.ControlGroup>
                <RichTextEditor.ControlGroup>
                    <Control.Undo />
                    <Control.Redo />
                </RichTextEditor.ControlGroup>
                <RichTextEditor.ControlGroup>
                    <InsertImageControl />
                </RichTextEditor.ControlGroup>
            </RichTextEditor.Toolbar>
            <Box position="relative">
                <DragHandle editor={editor}>
                    <Box
                        position="relative"
                        top="-0.5"
                        insetStart="-1"
                        cursor="grab"
                        color="fg.muted"
                        opacity=".6"
                        _hover={{ opacity: 1, color: 'fg' }}
                        _active={{ cursor: 'grabbing' }}
                    >
                        <Icon asChild boxSize="4">
                            <LuGripVertical />
                        </Icon>
                    </Box>
                </DragHandle>
            </Box>
            <RichTextEditor.Content />
        </RichTextEditor.Root>
    )
}

export default ProductEditor;