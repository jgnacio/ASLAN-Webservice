import { CardContent } from "@mui/material";
import { Card } from "@nextui-org/card";
import { FormPublishProduct } from "../../components/types/formTypes";
import Tiptap from "@/components/ui/TiptapTextEditor";

function ProductDescriptionEditor({
  productState,
  setProductState,
}: {
  productState: FormPublishProduct;
  setProductState: (product: FormPublishProduct) => void;
}) {
  return (
    <Tiptap
      content={productState.description}
      onChange={(content) => {
        setProductState({ ...productState, description: content });
      }}
    />
  );
}

export default ProductDescriptionEditor;
