import Image from "next/image";

export default function WelcomeSection() {
  return (
    <>
      {/* Left Side */}
      <div className="bg-background grid place-items-center relative">
        <h1 className="text-3xl font-semibold text-secondary absolute top-20">
          Welcome!
        </h1>
        <Image
          src="/new_door2.png"
          alt="left-side-auth"
          width={320}
          height={60}
        />
      </div>
      {/*Center Side */}

      <div className="flex flex-col justify-between items-center gap-6">
        <Image
          src="/project_1.png"
          alt="center-project-1"
          width={320}
          height={40}
          className="rounded-b-2xl"
        />
        <div className="px-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={70}
            height={40}
            className="mx-auto"
          />
          <p className="text-center mt-1 text-base font-medium">
            Catalog you will never found anywhere else
          </p>
        </div>
        <Image
          src="/project_1.png"
          alt="center-project-2"
          width={350}
          height={40}
          className="rounded-t-2xl"
        />
      </div>
      {/*Right Side*/}

      <div className="bg-background  grid place-items-center ">
        <Image
          src="/window.png"
          alt="right-side-auth"
          width={250}
          height={60}
        />
      </div>
    </>
  );
}
