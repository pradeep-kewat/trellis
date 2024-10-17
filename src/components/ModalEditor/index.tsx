/* eslint-disable no-unused-vars */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Flex } from "@chakra-ui/react";
import ReactQuill from "react-quill";

interface contentType {
  html: string;
  text: string;
}
interface Properties {
  placeHolder?: string;
  values: contentType;
  handleParentChange?: (content: string, text: string) => void;
}

const ModalEditor = ({
  values,
  placeHolder = "Text here",
  handleParentChange,
}: Properties) => {
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files) {
        var file = input.files[0];
        var formData = new FormData();

        formData.append("image", file);
        const response = await fetch("/api/s3", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        const quill = quillRef.current;

        if (quill) {
          const range = quill.getEditorSelection();
          range &&
            quill
              .getEditor()
              .insertEmbed(
                range.index,
                "image",
                "https://d1aqay64firrmi.cloudfront.net/dev/1726573143_text-logo.svg"
              );
        }
      }
    };
  }, []);

  const quillModules = React.useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "list",
    "bullet",
    "color",
    "link",
  ];

  const handleChange = (newContent: any, _: any, __: any, editor: any) => {
    const processedHtml = newContent
      .replace(/^\s*<p><br><\/p>\s*/i, "") // Remove <p><br></p> at the start of the content
      .trim(); // Remove any leading or trailing whitespace

    const processedText = editor
      .getText()
      .replace(/^\n/, "") // Remove a single newline at the start of the text
      .trim(); // Remove any leading or trailing whitespace

    if (processedHtml !== values.html || processedText !== values.text) {
      if (handleParentChange) {
        handleParentChange(processedHtml, processedText);
      }
    }
    // setContent({ html: processedHtml, text: processedText });
  };

  return (
    <Flex flexDir={"column"}>
      {/* <Flex flexDir={"column"} maxH={"calc(100% - 220px)"}> */}
      <ReactQuill
        ref={quillRef}
        value={values.html}
        onChange={handleChange}
        modules={quillModules}
        formats={quillFormats}
        className="quill-editor"
        placeholder={placeHolder}
      />
      <div id="toolbar">
        <div className="ql-tools">
          <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
          </select>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <select className="ql-color"></select>
        </div>
      </div>
    </Flex>
  );
};

export default ModalEditor;
