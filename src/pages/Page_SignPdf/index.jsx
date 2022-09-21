import React from "react";
import { useRef } from "react";

const Page_SignPdf = () => {
  const pdfInputRef = useRef();

  const uploadPdf = () => {};
  const onClick = () => {};
  return (
    <div>
      <input
        data-testid="pdf-input"
        ref={pdfInputRef}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Page_SignPdf;
