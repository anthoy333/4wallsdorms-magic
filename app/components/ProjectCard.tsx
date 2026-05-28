"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  size: "square" | "wide"
}

export default function ProjectCard({ title, description, image, size }: ProjectCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl shadow-lg bg-white ${
        size === "wide" ? "aspect-[2/1]" : "aspect-square"
      }`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          width={600}
          height={300}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
          <span>No image available</span>
        </div>
      )}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-200">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
