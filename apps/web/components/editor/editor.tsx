"use client";

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Editor({ value, onChange, placeholder }: Props) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "link"],
      ["clean"],
    ],
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Start typing..."}
        className="quill-editor-custom shadow-sm"
      />
    </div>
  );
}
