import React from "react";
import Navigation from "./navigation";
// import * as pdfjs from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import moment from "moment";
import 'moment/locale/vi'


const App = () => {
  moment.locale('vi')

  return <Navigation />;
};

export default App;
