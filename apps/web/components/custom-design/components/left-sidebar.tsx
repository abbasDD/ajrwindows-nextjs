"use client";

import { useMemo } from "react";

import { getShapeInfo } from "@/lib/utils";

const LeftSidebar = ({ allShapes }: { allShapes: Array<any> }) => {
  const memoizedShapes = useMemo(
    () => (
      <section className="flex flex-col border-r border-secondary/20 min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
        <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">
          Layers
        </h3>
        <div className="flex flex-col">
          {allShapes?.map((shape) => {
            const info = getShapeInfo(shape[1]?.type);
            const Icon = info?.Icon;

            return (
              <div
                key={shape[1]?.objectId}
                className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black"
              >
                {Icon && <Icon className={`w-4 h-4 `} />}

                <h3 className="text-sm font-semibold capitalize">
                  {info.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
    [allShapes?.length],
  );

  return memoizedShapes;
};

export default LeftSidebar;
