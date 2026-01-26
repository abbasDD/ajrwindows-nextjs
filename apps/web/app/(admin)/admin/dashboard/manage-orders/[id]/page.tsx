import OrderDetailsView from "@/components/admin-dashboard/manage-orders/order-deatils-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Order Details",
  description: "Detailed view of customer order",
};

interface Props {
  params: Promise<{ id: string }>;
}

const OrdersDetails = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <>
      <h1 className="text-xl font-semibold my-6">Orders Details</h1>
      <div className="mt-6">
        <OrderDetailsView orderId={id} />
      </div>
    </>
  );
};

export default OrdersDetails;
