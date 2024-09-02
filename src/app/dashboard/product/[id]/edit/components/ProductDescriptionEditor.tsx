// // Require Editor CSS files.
// import "froala-editor/css/froala_editor.pkgd.min.css";
// import "froala-editor/css/froala_style.min.css";
// import "froala-editor/css/third_party/embedly.min.css";

import { CardContent } from "@mui/material";
import { Card } from "@nextui-org/card";
import "froala-editor/js/plugins.pkgd.min.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ProductDescriptionEditor({
  contentPlainText,
  setContentPlainText,
}: {
  contentPlainText: string;
  setContentPlainText: (content: string) => void;
}) {
  return (
    // <Tabs defaultValue="froala">
    //   <TabsList>
    //     <TabsTrigger value="quill">Quill</TabsTrigger>
    //     <TabsTrigger value="froala">Froala</TabsTrigger>
    //   </TabsList>
    //   <TabsContent value="froala">
    //     <FroalaEditor
    //       tag="textarea"
    //       model={contentPlainText}
    //       onModelChange={setContentPlainText}
    //       config={{
    //         toolbarSticky: true,
    //         charCounterCount: false,
    //       }}
    //     />
    //   </TabsContent>
    //   <TabsContent value="quill">
    <Card>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={contentPlainText}
          onChange={setContentPlainText}
        />
      </CardContent>
    </Card>
    //   </TabsContent>
    // </Tabs>
  );
}

export default ProductDescriptionEditor;
