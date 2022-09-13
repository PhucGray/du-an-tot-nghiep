import "./styles.css";

import React, { useState, useRef, useEffect } from "react";
import * as Icon from "../../assets/icons";
import ModalUpdateImage from "../../components/Modal/ModalUpdateImage";
import { handleUploadImage, uploadBlobToStorage } from "../../utils/images";
import AvatarEditor from "react-avatar-editor";

const Profile = () => {
  const editorRef = useRef();
  const inputFileRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  return (
    <>
      {modalVisible && (
        <ModalUpdateImage
          setUrl={setUrl}
          image={image}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}

      {/* <AvatarEditor
        ref={editorRef}
        image={image?.data}
        width={250}
        height={250}
        border={50}
        scale={1}
        rotate={0}
      /> */}

      <input
        ref={inputFileRef}
        type="file"
        multiple={false}
        onChange={(e) =>
          handleUploadImage(e, (images) => {
            // console.log("run");

            // console.log(images[0]);
            setImage(images[0]);
            setModalVisible(true);
            e.target.value = null;
          })
        }
      />

      <div
        className="avatar-wrapper"
        onClick={() => inputFileRef.current?.click()}>
        <img
          src={
            url ||
            "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360"
          }
          className="avatar"
        />
      </div>

      <div>
        <div>Họ và tên: Nguyen Van A</div>
        <div>Chức vụ: Nguyen Van A</div>
      </div>
    </>
  );
};

export default Profile;
