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
import { setPingAction } from "./store/common/actions";
import * as TAB from './constants/tab'

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nguoiDung = useSelector(nguoiDungSelector);

  const [modalNoti, setModalNoti] = useState(false)

  const [isReload, setIsReload] = useState(false)

  useEffect(() => {
    moment.locale("vi");

    const unsub1 = onSnapshot(collection(db, "vaitro"), (doc) => {
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

    const unsub2 = onSnapshot(collection(db, "dexuat"), (doc) => {
      doc.docs.forEach(async (doc) => {
        const data = doc.data();

        const listOrder = data?.listOrder

        if(listOrder.length > 0 && listOrder?.[0]?.nguoiDung === nguoiDung?.ma_NguoiDung) {
          dispatch(setPingAction({ping: true, o: {
            deXuat: data?.deXuat,
            id: doc.id
          }}))
        } else {
          dispatch(setPingAction({ping: false, o: null}))
        }
      });
    });

    return () => {
      unsub1();
      unsub2()
    }
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
