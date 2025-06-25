
import { useMutation } from '@tanstack/react-query';

const useUploadExcel = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5600/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const json = await response.json();
      if (!json) throw new Error('No data received');

      return json;
    },
  });
};

export {useUploadExcel};
