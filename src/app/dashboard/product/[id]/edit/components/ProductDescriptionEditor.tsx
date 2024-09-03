import dynamic from "next/dynamic";
import { CardContent } from "@mui/material";
import { Card } from "@nextui-org/card";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

function ProductDescriptionEditor({
  contentPlainText,
  setContentPlainText,
}: {
  contentPlainText: string;
  setContentPlainText: (content: string) => void;
}) {
  return (
    <Card>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={contentPlainText}
          onChange={setContentPlainText}
        />
      </CardContent>
    </Card>
  );
}

export default ProductDescriptionEditor;
