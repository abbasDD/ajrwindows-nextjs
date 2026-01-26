"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-get-data";
import { ListOrdered, CheckCircle, User, Loader2 } from "lucide-react";

interface StaticsCardProps {
  title: string;
  statics: number;
  Icon: React.ReactNode;
  isLoading: boolean;
}

const StaticsCard = ({ title, statics, Icon, isLoading }: StaticsCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-5 py-8">
        <div className="bg-secondary text-primary rounded-full size-16 grid place-items-center shadow-lg shadow-secondary/10">
          {Icon}
        </div>
        <h1 className="text-xl font-medium text-white/70">{title}</h1>
        {isLoading ? (
          <Loader2 className="animate-spin text-secondary" size={24} />
        ) : (
          <p className="text-4xl font-bold text-white">{statics}</p>
        )}
      </CardContent>
    </Card>
  );
};

const UserStatics = () => {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StaticsCard
        title="Total Users"
        statics={stats.users}
        Icon={<User size={28} />}
        isLoading={isLoading}
      />
      <StaticsCard
        title="Pending Payments"
        statics={stats.active}
        Icon={<ListOrdered size={28} />}
        isLoading={isLoading}
      />
      <StaticsCard
        title="Completed Sales"
        statics={stats.completed}
        Icon={<CheckCircle size={28} />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserStatics;
