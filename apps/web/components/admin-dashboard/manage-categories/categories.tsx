"use client";
import { useState } from "react";
import AdminSectionCard from "../admin-section-card";
import { Button } from "@/components/ui/button";
import AddCategories from "./add-category";
import CategoryList from "./categories-lists";

const Categories = () => {
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
            Add Category
          </Button>
        }
      >
        <CategoryList />
      </AdminSectionCard>
      <AddCategories open={open} setOpen={setOpen} />
    </>
  );
};

export default Categories;
