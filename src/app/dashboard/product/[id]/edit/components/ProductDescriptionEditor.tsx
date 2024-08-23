import { useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/third_party/embedly.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

function ProductDescriptionEditor({
  contentPlainText,
}: {
  contentPlainText: string;
}) {
  const [content, setContent] = useState(contentPlainText || "");

  return (
    <FroalaEditor
      tag="textarea"
      model={content}
      onModelChange={setContent}
      config={{
        toolbarSticky: true,
        charCounterCount: false,
      }}
    />
  );
}

export default ProductDescriptionEditor;
