import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed w-screen h-screen z-50 bg-primary grid place-items-center">
      <LoaderCircle size={50} className=" animate-spin text-secondary" />
    </div>
  );
};

export default Loading;
