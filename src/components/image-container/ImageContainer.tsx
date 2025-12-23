"use client";

import { useEffect, useState } from "react";

import { useAppStore } from "../../stores/useAppStateStore";
import { type ImageMetadata } from "../../schemas/schemas";
import UserOnIcon from "../../assets/icons/user-on.svg";

export default function ImageContainer({
  image,
  altText,
}: {
  image: ImageMetadata;
  altText: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!image || !image.url) {
      console.error("Invalid image or url");
      return;
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const imageBlob = await useAppStore.getState().fetchAnImage(image.url);
        if (imageBlob) {
          const objectUrl = URL.createObjectURL(imageBlob);
          setFetchedImage(objectUrl);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(
            err.message || "Desculpe, ocorreu um erro ao carregar a imagem."
          );
        } else {
          setError("Desculpe, ocorreu um erro ao carregar a imagem.");
        }
        console.error("Error fetching image:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      // Cleanup object URL to avoid memory leaks
      if (fetchedImage) {
        URL.revokeObjectURL(fetchedImage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const ImagePlaceholder = () => (
    <div>
      <img
        style={{
          width: "100%",
          height: "100%",
          backgroundPosition: "center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
        src={UserOnIcon}
        alt="Placeholder"
      />
    </div>
  );

  if (isLoading) {
    return <ImagePlaceholder />;
  }
  if (error) {
    return <ImagePlaceholder />;
  }
  return fetchedImage ? (
    <div>
      <img
        style={{
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
        src={fetchedImage}
        alt={altText}
      />
    </div>
  ) : (
    <ImagePlaceholder />
  );
}
