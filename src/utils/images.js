import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

export const uploadBlobToStorage = async (blob) => {
  const time = new Date().toISOString();
  const storageRef = ref(storage, time.concat(new Date().toString()));
  await uploadBytes(storageRef, blob);
  const resultUrl = await getDownloadURL(storageRef);
  return resultUrl;
};

export const uploadImageToStorage = async (file) => {
  // console.log(file);
  const fileName = file?.name;
  // console.log(fileName);
  const storageRef = ref(storage, `/images/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      //  const progress = Math.round(
      //    (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      //  );
      //  setProgresspercent(progress);
    },
    (error) => {
      //  alert(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //  setImgUrl(downloadURL);
        console.log(downloadURL);
      });
    },
  );
  // const time = new Date().toString();
  // const fileName = file?.name;
  // const storageRef = ref(storage,'/images/' + time.concat(fileName));
  // await uploadBytes(storageRef, file);
  // const resultUrl = await getDownloadURL(storageRef);
  // return resultUrl;
};

export const handleUploadImage = async (e, callback, files = null) => {
  const _files = files || e.target.files;
  if (_files && _files.length > 0) {
    const selectedFiles = _files;

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

export const uploadBase64Image = async (base64) => {
  console.log(base64);
  const result = await fetch(base64);
  const blob = await result.blob();
  const url = await uploadBlobToStorage(blob);

  console.log(url);

  return url;
};

export const uploadImagToFirebase = async (e) => {
  const types = ["image/jpeg", "image/jpg", "image/png"];

  if (e.target.files && e.target.files.length > 0) {
    const selectedFile = e.target.files[0];

    if (selectedFile && types.includes(selectedFile.type)) {
      // dispatch(
      //     setLoading({
      //         state: true,
      //         message: isVietnames
      //             ? 'Đang tải ảnh...'
      //             : 'Uploading...',
      //     }),
      // );

      const time = new Date().toISOString();
      const fileName = selectedFile.name;

      const storageRef = ref(storage, time.concat(fileName));

      await uploadBytes(storageRef, selectedFile);

      const resultUrl = await getDownloadURL(storageRef);

      return resultUrl;
      // if (resultUrl) {sss
      //     const newMessage = {
      //         msg: {
      //             type: 'image',
      //             content: resultUrl,
      //         },
      //         sentAt: new Date().toString(),
      //         uid: user?.uid,
      //     } as MessageType;

      //     await updateDoc(conversationDocumentRef, {
      //         messages: arrayUnion(newMessage),
      //     });

      //     dispatch(setLoading({ state: false }));
      // }
    } else {
    }
  }

  return null;
};
