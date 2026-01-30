export interface ProductTypeDataType {
  id: number;
  name: string;
  slug: string;
  category_id: string;
  created_at: string;
  categories?: { category: string };
}

export interface ProductDataType {
  id?: string; // UUID
  category_id: string; // UUID reference to categories
  product_type_id: string; // UUID reference to product types
  product_name: string;
  slug: string;
  usage: string;
  color: string;
  price: number;
  discounted_price: number;
  description: string;
  frame_width: string;
  frame_height: string;
  frame_material: string;
  sill_material: string;
  paint_type: string;
  slab_width: string;
  slab_height: string;
  slab_material: string;
  slab_style: string;
  glass_type: string;
  glazing: string;
  hinge: string;
  image_url: string; // Array of image URLs
}

export interface PromoCodeTypes {
  code: string;
  type: string;
  value: number;
  min_order_amount: number;
  max_discount: number;
  usage_limit: number;
  valid_from: string | Date;
  valid_until: string | Date;
  is_active: boolean;
}
