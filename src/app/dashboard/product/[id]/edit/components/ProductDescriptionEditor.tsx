import { useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/third_party/embedly.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

function ProductDescriptionEditor({
  contentPlainText,
  setContentPlainText,
}: {
  contentPlainText: string;
  setContentPlainText: (content: string) => void;
}) {
  return (
    <FroalaEditor
      tag="textarea"
      model={contentPlainText}
      onModelChange={setContentPlainText}
      config={{
        toolbarSticky: true,
        charCounterCount: false,
      }}
    />
  );
}

export default ProductDescriptionEditor;
