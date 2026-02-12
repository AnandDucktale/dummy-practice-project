import { useState } from 'react';
import { uploadDocument } from '../../services/groupPage.services';

export default function useGroupDocument(groupId) {
  const [files, setFiles] = useState([]);
  const [docError, setDocError] = useState('');
  const [docStatus, setDocStatus] = useState('');
  const [filePreviews, setFilePreviews] = useState([]);

  const getThumbnail = async (videoFile, seekTime = 0.2) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(videoFile);

      video.src = url;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        video.currentTime = Math.min(seekTime, video.duration);
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            resolve(blob);
          },
          'image/jpeg',
          0.75,
        );

        // const dataUrl = canvas.toDataURL('image/jpeg');
        // resolve(dataUrl);
      });

      video.onerror = (err) => reject('Video loading failed');
    });
  };

  const handleSelectionDoc = (preview) => {
    setFiles((prev) => prev.filter((item) => item.name !== preview.file.name));
    setFilePreviews((prev) =>
      prev.filter((item) => item.file.name !== preview.file.name),
    );
  };

  const handleDocumentSubmission = async () => {
    setDocError('');
    try {
      const data = await uploadDocument({ files, groupId });

      setDocStatus(data.message || 'Documents Uploaded');
      setFilePreviews([]);
      setFiles([]);
    } catch (error) {
      console.log(
        error?.response?.data?.message ||
          error.message ||
          'Internal server error',
      );

      setDocError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    }
  };

  const handleFilePreviews = async (event) => {
    const files = Array.from(event.target.files);
    // setFiles(files);
    // console.log(files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.split('/')[0],
    }));

    const filteredPreviews = previews.filter((preview) => {
      if (preview.type === 'video') {
        return preview.file.size <= 1048576 * 15;
      } else if (preview.type === 'audio') {
        return preview.file.size <= 1048576 * 5;
      } else {
        return preview.file.size <= 1048576 * 2;
      }
    });

    const fetchThumbnail = async () => {
      for (let preview of filteredPreviews) {
        if (preview.type === 'video') {
          // console.log(preview.split('blob:')[0]);

          const thumbnailBlob = await getThumbnail(preview.file);

          const url = URL.createObjectURL(thumbnailBlob);

          preview.thumbnail = url;
          // preview.thumbnail = thumbnailBlob;
          // console.log(preview);
          // console.log(thumbnailBlob);
        }
      }
    };
    await fetchThumbnail();

    if (filteredPreviews.length !== previews.length) {
      toast.warn('File size not more than its limit');
    }
    // files.forEach((file) => console.log(file));

    setFilePreviews(filteredPreviews);
  };

  const handleFileSelection = async (event) => {
    await handleFilePreviews(event);
    const files = Array.from(event.target.files);
    const filteredFiles = files.filter((file) => {
      if (file.type === 'video/mp4' || file.type === 'video/mpeg') {
        return file.size <= 1048576 * 15;
      } else if (file.type === 'audio/mpeg') {
        return file.size <= 1048576 * 5;
      } else {
        return file.size <= 1048576 * 2;
      }
    });

    setFiles(filteredFiles);
  };

  const handleDeleteDocument = async () => {
    setDocError('');
    try {
      const response = await api.post('/group/deleteDocuments', {
        selectedDocsIds: selectedDocsIds,
      });

      toast.success(
        response?.data.message || 'Documents deleted',
        toastParameters,
      );

      setSelectedDocsIds([]);
      setSelectionOpen(false);
      // await fetchGroupData(groupId);
    } catch {
      setDocError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    }
  };

  return {
    files,
    docError,
    filePreviews,
    docStatus,
    handleFilePreviews,
    handleSelectionDoc,
    handleDocumentSubmission,
    handleFileSelection,
    handleDeleteDocument,
  };
}
