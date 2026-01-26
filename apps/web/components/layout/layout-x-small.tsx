import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function LayoutXSmall({ children, className }: Props) {
  return (
    <div className={cn("px-6 sm:px-14 lg:px-32", className)}>{children}</div>
  );
}
export default LayoutXSmall;
