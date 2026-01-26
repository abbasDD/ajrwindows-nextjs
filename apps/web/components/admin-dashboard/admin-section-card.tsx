import { Card, CardContent } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  statics?: number;
}

const AdminSectionCard = ({
  title,
  action,
  children,
  statics,
}: SectionCardProps) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center">
        <h2 className="font-medium text-xl">
          {title}
          {statics && (
            <span className="ml-2 text-sm py-1 px-2 rounded-3xl bg-secondary text-black">
              {statics}
            </span>
          )}
        </h2>
        {action && action} {/* render any component here */}
      </CardContent>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AdminSectionCard;
