import "./styles.css";

import React, { useState } from "react";
import * as Icon from "../../assets/icons";
import ModalUpdateImage from "../../components/Modal/ModalUpdateImage";

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <ModalUpdateImage
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <div>
        <div className="avatar-wrapper" onClick={() => setModalVisible(true)}>
          <img src="https://joeschmoe.io/api/v1/random" className="avatar" />
          <div className="avatar-icon">
            <Icon.Camera size={30} color="#fff" />
          </div>
        </div>

        <div>Họ và tên: Nguyen Van A</div>
        <div>Chức vụ: Nguyen Van A</div>
      </div>
    </>
  );
};

export default Profile;
