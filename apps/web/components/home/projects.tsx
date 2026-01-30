"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const allProjects = [
  { id: 1, image: "/assets/projects/project_1.png" },
  { id: 2, image: "/assets/projects/project_2.png" },
  { id: 3, image: "/assets/projects/project_3.png" },
  { id: 4, image: "/assets/projects/project_4.png" },
  { id: 5, image: "/assets/projects/project_5.png" },
];

const duplicatedProjects = [...allProjects, ...allProjects, ...allProjects];

const Projects = () => {
  const router = useRouter();

  return (
    <section className="my-20 relative w-full overflow-hidden  py-10">
      <div className="flex">
        <motion.div
          className="flex flex-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="relative flex-shrink-0 w-[250px] md:w-[400px] h-[250px] md:h-[300px] px-2"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/5">
                <Image
                  src={project.image}
                  alt="Project"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500 brightness-50 hover:brightness-100"
                  sizes="(max-width: 768px) 250px, 400px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <button
          onClick={() => router.push("/categories")}
          className="pointer-events-auto cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full text-white text-base font-semibold shadow-2xl hover:bg-primary hover:scale-110 transition-all duration-300"
        >
          See All Projects
        </button>
      </div>

      <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default Projects;
