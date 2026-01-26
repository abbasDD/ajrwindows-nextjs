"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

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
