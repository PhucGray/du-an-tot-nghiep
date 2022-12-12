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

  console.log(API_DOMAIN + '/' + vanBan?.file)

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
        <Descriptions.Item span={1} label="Ngày tạo">
          {moment(vanBan?.ngayTao).format("DD-MM-YYYY")}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Ngày hiệu lực">
          {moment(vanBan?.ngay_HieuLuc).format("DD-MM-YYYY")}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item span={1} label="Ngời ký">
          {vanBan?.nguoiKy}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="File">
          {vanBan?.file ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(API_DOMAIN + vanBan?.file, "_BLANK");
              }}>
              {vanBan?.ten_FileGoc}
            </div>
          ) : (
            <div>Không có</div>
          )}
        </Descriptions.Item>
      </Descriptions>
      {vanBan?.file && fileType &&<div style={{ textAlign: "center", marginTop: 40, fontSize: 20, marginBottom: 20 }}>
        File preview
      </div>}
      {/* <iframe
        style={{ marginTop: 30 }}
        width={"100%"}
        height={800}
        src={API_DOMAIN + vanBan?.file}></iframe> */}

      {/* {vanBan?.file && <DocViewer  documents={[{uri: API_DOMAIN + '/' + vanBan?.file}]} />} */}

      {vanBan?.file && fileType && 
        <FileViewer 
          fileType={fileType}
          filePath={API_DOMAIN + '/' + vanBan?.file}
        />}
    </>
  );
};

export default ChiTietVanBan;
