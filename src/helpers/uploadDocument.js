import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';

// CONFIGURE DOTENV
dotenv.config();

const uploadDocument = async (file, options) => {
  const storage = new Storage({
    projectId: 'adminatete-386115',
    keyFilename: 'upload_files.json',
  });

  try {
    const fileCloud = storage
      .bucket('task_manager_qt')
      ?.file(`${options?.folder}/${options?.fileName}.${options?.extension}`);

    await fileCloud.save(file?.buffer, {
      metadata: {
        contentType: file?.mimetype,
      },
      public: true,
    });

    return {
      url: `https://storage.googleapis.com/task_manager_qt/${options?.folder}/${options?.fileName}.${options?.extension}`,
      originalFileName: file?.originalname,
    };
  } catch (error) {
    return {
      status: false,
      message: error?.message
    }
  }
};

export const getFileExtension = (filename) => {
  if (!filename) return null;
  return filename?.split('.')?.pop();
};

export default uploadDocument;
