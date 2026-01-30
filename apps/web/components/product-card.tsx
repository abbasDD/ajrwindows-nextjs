import Image from "next/image";
import Link from "next/link";
import { ProductDataType } from "@/types/product-types";
import { Card, CardContent } from "./ui/card";

const ProductCard = ({ product }: { product: ProductDataType }) => {
  const hasDiscount =
    product.discounted_price > 0 && product.discounted_price < product.price;

  return (
    <Card className="group space-y-4">
      <CardContent>
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-300 ">
            <Image
              src={product.image_url}
              alt={product.product_name}
              fill
              className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        <div>
          <h3 className="text-white text-base md:text-lg font-medium truncate">
            {product.product_name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-secondary font-bold text-lg">
              ${hasDiscount ? product.discounted_price : product.price}
              <span className="text-[10px] ml-1 text-white/40 font-normal">
                CAD
              </span>
            </span>
            {hasDiscount && (
              <span className="text-white/30 text-xs line-through">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProductCard;
