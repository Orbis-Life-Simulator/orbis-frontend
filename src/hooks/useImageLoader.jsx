import { useState, useEffect } from 'react';

/**
 * Hook customizado para carregar uma lista de imagens e retorná-las
 * como objetos HTMLImageElement, prontos para serem usados no Konva.
 * @param {string[]} imageUrls - Um array com os caminhos das imagens a serem carregadas.
 */
export const useImageLoader = (imageUrls) => {
  const [images, setImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    const loadedImages = {};

    if (totalImages === 0) {
      setIsLoading(false);
      return;
    }

    imageUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;

      const onFinish = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };
      
      img.onload = () => {
        loadedImages[url] = img;
        onFinish();
      };
      
      img.onerror = () => {
        console.error(`Falha ao carregar a imagem: ${url}`);
        onFinish();
      };
    });
  }, [imageUrls]);

  return { images, isLoading };
};