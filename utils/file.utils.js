export const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype.startsWith('video/')) {
    return 'video';
  } else if (
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'text/plain'
  ) {
    return 'document';
  } else {
    return 'other';
  }
};

export const getFileUrl = (filename) => {
  return `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/tasks/${filename}`;
};