import Image from "next/image";
import Link from "next/link";

const Ecatalog = () => {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden">
      <Image
        src="/assets/ecat-img.webp"
        alt="E-Catalog Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-blue-950/70 to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-white text-4xl  md:text-6xl font-bold tracking-tighter leading-none">
          E-Catalog
        </h2>
        <p className="text-white/60 tracking-wide pt-4 text-sm sm:text-lg max-w-lg font-medium">
          See our full product line for doors & windows
        </p>

        <div className="mt-10">
          <Link href="/catalog">
            <button className="pointer-events-auto cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full text-white text-lg font-semibold shadow-2xl hover:bg-primary hover:scale-110 transition-all duration-300">
              Download Catalog PDF
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ecatalog;
