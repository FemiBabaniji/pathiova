"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Card from "@/components/ui/card2";
import CardTitle from "@/components/ui/card-title";
import CardDescription from "@/components/ui/card-description";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-20 py-10", // Adjust grid to 2x2 and increase gap
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group block h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: 1.05, // Slightly increase the scale on hover
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  scale: 1,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="h-full p-8 transform transition-transform duration-200 group-hover:scale-105"> {/* Smooth scale on hover */}
            <div>
              <CardTitle className="text-2xl text-orange-500">{item.title}</CardTitle> 
              <CardDescription className="text-lg mt-6 text-gray-700">{item.description}</CardDescription>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default HoverEffect;
