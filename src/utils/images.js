import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { storage } from "../firebase";

export const uploadBlobToStorage = async (blob) => {
  const time = new Date().toISOString();
  const storageRef = ref(storage, time.concat(new Date().toString()));
  await uploadBytes(storageRef, blob);
  const resultUrl = await getDownloadURL(storageRef);
  return resultUrl;
};

export const uploadImageToStorage = async (file) => {
  const time = new Date().toISOString();
  const fileName = file?.name;
  const storageRef = ref(storage, time.concat(fileName));
  await uploadBytes(storageRef, file);
  const resultUrl = await getDownloadURL(storageRef);
  return resultUrl;
};

export const handleUploadImage = async (e, callback) => {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFiles = e.target.files;

    let images = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          images.push({ data: reader.result, file });
        }
      };

      reader.onloadend = () => {
        if (i === selectedFiles.length - 1) {
          callback(images);
        }
      };

      reader.readAsDataURL(file);
    }
  }
};
