import React from "react";
import { useState } from "react";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const useUploadFileToFireBase = ({ file }) => {
  const [percent, setPercent] = useState(0);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    setUploading(true);

    const fileName = uuidv4() + file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        setPercent(percent);
      },
      (err) => {
        console.log(err);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setUrl(url?.replace('%', ''));
          })
          .finally(() => {
            setUploading(false);
          });
      },
    );
  };

  const resetFile = () => {
    setUrl("");
    setUploading(false)
    setPercent(0);
  };

  return {
    uploadFile,
    percent,
    url,
    uploading,
    resetFile,
    setUrl
  };
};

export default useUploadFileToFireBase;
