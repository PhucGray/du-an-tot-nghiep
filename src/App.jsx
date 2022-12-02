import React, { useEffect } from "react";
import Navigation from "./navigation";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
// import * as pdfjs from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import moment from "moment";
import "moment/dist/locale/vi";
import { db } from "./firebase";
import { useSelector } from "react-redux";
import { nguoiDungSelector } from "./store/auth/selectors";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearNguoiDung } from "./store/auth/actions";
import { Button, Modal } from "antd";
import { useState } from "react";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [modalNoti, setModalNoti] = useState(false)

  useEffect(() => {
    moment.locale("vi");

    const unsub = onSnapshot(collection(db, "realtime"), (doc) => {
      // console.log("Current data: ", doc.data());
      doc.docs.forEach(async (doc) => {
        const data = doc.data();

        if (data?.maSo === nguoiDung?.ma_NguoiDung) {
          await deleteDoc(doc.ref);
          dispatch(clearNguoiDung());
          navigate("/", { replace: true });
          setModalNoti(true)
        } else {
        }
      });
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Modal
        open={modalNoti}
        onCancel={() => {
          setModalNoti(false)
        }}
        footer={null}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          Thông báo
        </div>
        <p
          style={{
            marginTop: 10
          }}
        >
          Tài khoản của bạn đã được cập nhật vai trò mới. Vui lòng đăng nhập lại
          để sử dụng hệ thống
        </p>
        <Button 
          key="back" 
          type="primary" 
          onClick={() => {
            setModalNoti(false)
          }}
          style={{
            width: 200,
            height: 40,
            display: "block",
            marginInline: 'auto'
          }}
          >
          Đồng ý
        </Button>
      </Modal>
      <Navigation />
    </>
  );
};

export default App;
