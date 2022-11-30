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

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nguoiDung = useSelector(nguoiDungSelector);

  useEffect(() => {
    moment.locale("vi");

    const unsub = onSnapshot(collection(db, "realtime"), (doc) => {
      // console.log("Current data: ", doc.data());
      doc.docs.forEach(async doc => {
        const data = doc.data();

        if(data?.maSo === nguoiDung?.ma_NguoiDung) {
          await deleteDoc(doc.ref)
          dispatch(clearNguoiDung());
          navigate('/', {replace: true});
        //  await deleteDoc(doc(db, "realtime", '0qxui49TNSUQTgMUxCuX'))
          // .then(() => {
          //   console.log('chayyyyyyyyyyyyyyy')
          //   dispatch(clearNguoiDung());
          //   navigate('/', {replace: true});
          // })
          
        } else {
        }
      })
    });
    return () => unsub();
  }, []);

  return <Navigation />;
};

export default App;
