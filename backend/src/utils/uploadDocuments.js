export const uploadDocuments = async (documents) => {
  const files = Array.isArray(documents) ? documents : [documents];

  if (files.length === 0) {
    throw new ApiError(400, 'No files uploaded.');
  }

  const filteredFiles = files.filter((file) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg') {
      return file.size <= 1048576 * 15;
    } else if (file.mimetype === 'audio/mpeg') {
      return file.size <= 1048576 * 5;
    } else {
      return file.size <= 1048576 * 2;
    }
  });

  if (filteredFiles.length !== files.length) {
    throw new ApiError(400, 'Files size not more than its limit');
  }

  const uploadDir = path.join(process.cwd(), 'uploads');

  const savedDocuments = [];

  for (const file of filteredFiles) {
    const fileExt = path.extname(file.name);
    const fileName = `document-${Date.now()}-${Math.random()
      .toString()
      .slice(2)}${fileExt}`;

    const uploadPath = path.join(uploadDir, fileName);

    await file.mv(uploadPath);
    // await new Promise((r) => setTimeout(r, 300));

    let thumbnailName = `thumbnail-${Date.now()}-${Math.random()
      .toString()
      .slice(2)}.jpg`;
    const thumbDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    if (file.mimetype.startsWith('video/')) {
      await new Promise((resolve, reject) => {
        ffmpeg(uploadPath)
          .screenshots({
            timestamps: ['00:00:00.100'],
            filename: thumbnailName,
            folder: thumbDir,
            size: '640x?',
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (file.mimetype === 'application/pdf') {
      await pdf.convert(uploadPath, {
        format: 'jpeg',
        out_dir: thumbDir,
        out_prefix: path.basename(thumbnailName, '.jpg'),
        page: 1,
      });
      thumbnailName = thumbnailName.replace('.jpg', '-1.jpg');
    }

    const fileUrl = `http://localhost:9999/uploads/${fileName}`;
    const thumbnailUrl = `http://localhost:9999/uploads/thumbnails/${thumbnailName}`;
    return { fileUrl, thumbnailUrl };
  }
};
