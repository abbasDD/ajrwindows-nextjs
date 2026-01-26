import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function LayoutXLarge({ children, className }: Props) {
  return (
    <div className={cn("max-w-7xl mx-auto w-full p-4 ", className)}>
      {children}
    </div>
  );
}
export default LayoutXLarge;
