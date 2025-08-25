"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogImage {
  id: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  order_index: number;
}

interface MultimediaShowcaseProps {
  images: BlogImage[];
  title?: string;
  className?: string;
}

export function MultimediaShowcase({
  images,
  title,
  className = "",
}: MultimediaShowcaseProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const sortedImages = [...images].sort(
    (a, b) => a.order_index - b.order_index
  );

  const openModal = (index: number) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % sortedImages.length);
    }
  };

  const previousImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? sortedImages.length - 1 : selectedImage - 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      previousImage();
    }
  };

  return (
    <div className={className}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openModal(index)}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => openModal(index)}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">
                {selectedImage !== null && sortedImages[selectedImage]?.caption}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {selectedImage !== null && (
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={sortedImages[selectedImage].image_url}
                    alt={sortedImages[selectedImage].alt_text}
                    className="w-full h-full object-contain max-h-[70vh]"
                  />

                  {/* Navigation Buttons */}
                  {sortedImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-full"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-full"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {selectedImage !== null &&
                `${selectedImage + 1} of ${sortedImages.length}`}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
