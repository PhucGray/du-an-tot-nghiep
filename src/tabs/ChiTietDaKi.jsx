import { Empty, Spin } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_DOMAIN } from "../configs/api";
import { RETCODE_SUCCESS, SUCCESS } from "../constants/api";
import { getFileChiTiet } from "../store/maQR/service";
const ChiTietDaKi = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const a = async () => {
      try {
        const res = await getFileChiTiet({ id: params?.id || "afbawf" });

        if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
          const fileDaKy = res.data?.data?.kySoDeXuat?.fileDaKy;
          if (!!fileDaKy) {
            setUrl(API_DOMAIN + fileDaKy);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    a();
  }, []);
  return (
    <>
      {!loading && (
        <>
          {url ? (
            <iframe
              style={{
                height: "100vh",
                width: "100vw",
              }}
              src={url}
              title="description"></iframe>
          ) : (
            <div
              style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default ChiTietDaKi;
