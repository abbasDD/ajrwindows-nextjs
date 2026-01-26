import PublicLayout from "@/components/layout/public-layout";
import LayoutXLarge from "@/components/layout/layout-x-large";
import UserOrdersTable from "@/components/user-orders/user-orders-table";

export default function UserOrdersPage() {
  return (
    <PublicLayout>
      <LayoutXLarge className="min-h-screen mt-32 mb-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your recent purchases.
            </p>
          </div>
          <UserOrdersTable />
        </div>
      </LayoutXLarge>
    </PublicLayout>
  );
}
