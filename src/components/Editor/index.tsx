/* eslint-disable no-unused-vars */

"use client";

import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button, Flex, Spinner } from "@chakra-ui/react";
import ReactQuill from "react-quill";
interface contentType {
  html: string;
  text: string;
}
interface Properties {
  allowEmpty?: boolean;
  placeHolder?: string;
  defaultContent: contentType;
  handleEditorChange?: (content: string, text: string) => void;
}

const Editor = ({
  placeHolder = "Text here",
  defaultContent,
  handleEditorChange,
}: Properties) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState({ text: "", html: "" });

  useEffect(() => {
    setContent(defaultContent);
  }, [defaultContent]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (handleEditorChange) {
      await handleEditorChange(content.html, content.text);
      setIsLoading(false);
    }
  };

  const handleChange = (newContent: any, _: any, __: any, editor: any) => {
    const processedHtml = newContent
      .replace(/^\s*<p><br><\/p>\s*/i, "") // Remove <p><br></p> at the start of the content
      .trim(); // Remove any leading or trailing whitespace

    const processedText = editor
      .getText()
      .replace(/^\n/, "") // Remove a single newline at the start of the text
      .trim(); // Remove any leading or trailing whitespace
    setContent({ html: processedHtml, text: processedText });
  };

  return (
    <Flex flexDir={"column"} width={"100%"}>
      <ReactQuill
        className="quill-editor"
        theme="snow"
        bounds={".quill-editor"}
        placeholder={placeHolder}
        modules={{
          toolbar: {
            container: [
              [{ size: ["small", "large", "huge"] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link"],
              ["code-block"],
            ],
          },
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "code-block",
        ]}
        value={content.html}
        onChange={handleChange}
      />
      <Button
        onClick={handleSubmit}
        isDisabled={defaultContent.html === content.html || isLoading}
        variant={"save_button"}
      >
        Submit {isLoading && <Spinner ml={"4"} />}
      </Button>
    </Flex>
  );
};

export default Editor;
