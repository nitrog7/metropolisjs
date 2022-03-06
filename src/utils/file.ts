export const convertFileToBase64 = (file: File, maxSize: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        // Resize the image
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const {height, width} = image;
        let updatedHeight: number = height;
        let updatedWidth: number = width;

        if(width > height) {
          if(width > maxSize) {
            updatedHeight *= maxSize / width;
            updatedWidth = maxSize;
          }
        } else if(height > maxSize) {
          updatedWidth *= maxSize / height;
          updatedHeight = maxSize;
        }

        canvas.width = updatedWidth;
        canvas.height = updatedHeight;
        canvas.getContext('2d').drawImage(image, 0, 0, updatedWidth, updatedHeight);
        const dataUrl: string = canvas.toDataURL('image/jpeg');
        // const resizedImage = dataURLToBlob(dataUrl);

        resolve(dataUrl);
        // $.event.trigger({
        //   type: 'imageResized',
        //   blob: resizedImage,
        //   url: dataUrl
        // });
      };

      const originalBase64: string = reader.result as string;
      image.src = originalBase64;
    };
    // reader.onloadend = () => {
    //   const base64: string = reader.result as string;
    //   resolve(base64);
    // };
    reader.onerror = (event: ProgressEvent) => {
      reject(event);
    };
    reader.readAsDataURL(file);
  });
