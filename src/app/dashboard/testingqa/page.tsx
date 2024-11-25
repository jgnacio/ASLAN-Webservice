"use client";
import { useMutation } from "@tanstack/react-query";
import { getCDROptions } from "./_actions/test-soap-cdr";
import { getCDRProducts } from "./_actions/get-products-soap-cdr";
import { Button } from "@/components/ui/button";

export default function TestingQA() {
  const {
    mutateAsync: server_getOptionsCDR,
    isPending: getOptionsCDR_isPending,
    data: getOptionsCDR_data,
    error: getOptionsCDR_error,
  } = useMutation({
    mutationFn: getCDROptions,
    onError: (error) => {
      console.error("Error fetching CDR options:", error);
    },
    onSuccess: (data) => {
      console.log("CDR options fetched:", data);
    },
  });

  const {
    mutateAsync: server_getProductsCDR,
    isPending: getProductsCDR_isPending,
    data: getProductsCDR_data,
    error: getProductsCDR_error,
  } = useMutation({
    mutationFn: getCDRProducts,
    onError: (error) => {
      console.error("Error fetching CDR products:", error);
    },
    onSuccess: (data) => {
      console.log("CDR products fetched:", data);
    },
  });

  const HandleGetOptions = () => {
    server_getOptionsCDR();
  };

  const HandleGetProducts = () => {
    server_getProductsCDR();
  };
  return (
    <div>
      <h1>Testing QA</h1>
      <p>This is a page for testing the QA process.</p>
      <Button onClick={HandleGetOptions}>Get Options CDR</Button>
      <Button onClick={HandleGetProducts}>Get Products CDR</Button>
    </div>
  );
}
