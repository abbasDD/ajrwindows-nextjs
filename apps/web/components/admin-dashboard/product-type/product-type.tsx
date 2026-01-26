"use client";
import { useState } from "react";
import AdminSectionCard from "../admin-section-card";
import { Button } from "@/components/ui/button";
import AddProductType from "./add-product-type";
import ProductTypeList from "./product-lists";

const ProductType = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AdminSectionCard
        title="Categories"
        action={
          <Button
            onClick={() => setOpen(true)}
            size={"lg"}
            variant={"secondary"}
          >
            Add Product Type
          </Button>
        }
      >
        <ProductTypeList />
      </AdminSectionCard>
      <AddProductType open={open} setOpen={setOpen} />
    </>
  );
};

export default ProductType;
