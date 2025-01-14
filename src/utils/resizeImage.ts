// resizeImage.ts

/**
 * Функция для изменения размера изображения.
 * @param file - Входной файл изображения (тип File).
 * @param width - Ширина уменьшенного изображения.
 * @param height - Высота уменьшенного изображения.
 * @returns Promise<File> - Возвращает уменьшенное изображение в виде File.
 */
export async function resizeImage(file: File, width: number, height: number): Promise<File> {
  if (file.type.startsWith('video')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) {
        reject(new Error('Ошибка чтения файла'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось получить контекст 2D'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = `${file.name.split('.')[0]}-min.${file.name.split('.').pop()}`;
            resolve(new File([blob], newFileName, { type: blob.type }));
          } else {
            reject(new Error('Не удалось создать Blob'));
          }
        }, file.type);
      };

      img.onerror = () => {
        reject(new Error('Ошибка загрузки изображения'));
      };

      img.src = event.target.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsDataURL(file);
  });
}
