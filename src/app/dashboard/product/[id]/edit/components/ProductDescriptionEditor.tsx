import dynamic from "next/dynamic";
import { CardContent } from "@mui/material";
import { Card } from "@nextui-org/card";
import { FormPublishProduct } from "../../components/types/formTypes";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

function ProductDescriptionEditor({
  productState,
  setProductState,
}: {
  productState: FormPublishProduct;
  setProductState: (product: FormPublishProduct) => void;
}) {
  return (
    <Card>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={productState.description}
          onChange={(value) => {
            setProductState({
              ...productState,
              description: value,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}

export default ProductDescriptionEditor;
