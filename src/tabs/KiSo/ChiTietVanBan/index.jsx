import React, { useEffect } from "react";
import { Badge, Button, Descriptions } from "antd";
import { getVanBanSvc } from "../../../store/vanban/services";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { RETCODE_SUCCESS, SUCCESS } from "../../../constants/api";
import { useState } from "react";
import moment from "moment";
import { API_DOMAIN } from "../../../configs/api";
import { useMemo } from "react";
import { ArrowLeftOutlined, ArrowDownOutlined } from "@ant-design/icons";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import FileViewer from 'react-file-viewer';

const ChiTietVanBan = () => {
  const params = useParams();

  const [vanBan, setVanBan] = useState(null);
  const [fileType, setFileType] = useState(null)

  const fetchVanBan = async (id) => {
    try {
      const res = await getVanBanSvc({ id });

      // console.log(res.data?.data)
      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const vanBan = res.data?.data;
        setVanBan(vanBan);

        const fileName = vanBan?.ten_FileGoc || "";
        let fileType = null;

        if (fileName.includes(".pdf")) fileType = "pdf";
        else if (fileName.includes(".docx") || fileName.includes(".doc"))
          fileType = "docx";
        else if (
          fileName.includes(".png") ||
          fileName.includes(".jpg") ||
          fileName.includes(".jpeg")
        )
          fileType = "png";

        // console.log(fileType);
        setFileType(fileType)
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchVanBan(parseInt(params?.id));
    }
  }, [params?.id]);

  const navigate = useNavigate();

  // const download = () => {
  //   var element = document.createElement("a");
  //   console.log(API_DOMAIN + '/' + vanBan?.file)
  //   var file = new Blob(
  //     [
  //       API_DOMAIN + '/' + vanBan?.file
  //     ],
  //     { type: "image/*" }
  //   );
  //   element.href = URL.createObjectURL(file);
  //   element.download = vanBan?.ten_FileGoc;
  //   element.click();
  // };
  const download = async() => {
    const originalImage=API_DOMAIN + '/' + vanBan?.file
    const image = await fetch(originalImage);
   
    //Split image name
    const nameSplit=originalImage.split("/");
    const  duplicateName=nameSplit.pop();
   
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL;
    link.download = ""+vanBan?.ten_FileGoc+"";
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)  
   };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div
          style={{
            fontSize: 20,
            marginLeft: 40,
            marginTop: 20,
            marginBottom: 10,
          }}>
          Chi tiết văn bản
        </div>

        <Button
          type="link"
          className="d-flex align-items-center"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            navigate(-1);
          }}>
          Danh sách
        </Button>
      </div>
      <Descriptions title="" layout="vertical" bordered>
        <Descriptions.Item span={1} label="Chủ đề">
          {vanBan?.chuDe}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Loại văn bản">
          {vanBan?.loaiVanBan}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item span={1} label="Người tạo">
          {vanBan?.nguoiDung?.hoTen}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Ngày hiệu lực">
          {moment(vanBan?.ngay_HieuLuc).format("DD-MM-YYYY")}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item span={1} label="Người ký">
          {vanBan?.nguoiKy}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="File">
          {vanBan?.file ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                if(fileType === 'png') {
                  download()
                } else {
                  window.open(API_DOMAIN + vanBan?.file, "_BLANK");
                }

              }}>
              {vanBan?.ten_FileGoc}

              {fileType !== 'pdf' && <span style={{color: 'blue'}}>{' '}Download</span>}
            </div>
          ) : (
            <div>Không có</div>
          )}
        </Descriptions.Item>
      </Descriptions>
      {vanBan?.file && fileType &&<div style={{ textAlign: "center", marginTop: 40, fontSize: 20, marginBottom: 20 }}>
        File preview
      </div>}
     {fileType === 'pdf' && <iframe
        style={{ marginTop: 30 }}
        width={"100%"}
        height={800}
        src={API_DOMAIN + '/' + vanBan?.file}></iframe>}

      {/* {vanBan?.file && <DocViewer  documents={[{uri: API_DOMAIN + '/' + vanBan?.file}]} />} */}

      {vanBan?.file && fileType && fileType !== 'pdf' && 
        <FileViewer 
          fileType={fileType}
          filePath={API_DOMAIN + '/' + vanBan?.file}
        />}
    </>
  );
};

export default ChiTietVanBan;
