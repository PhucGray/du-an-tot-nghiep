import { Button, Empty, Spin } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { API_DOMAIN } from "../configs/api";
import { RETCODE_SUCCESS, SUCCESS } from "../constants/api";
import { nguoiDungSelector } from "../store/auth/selectors";
import { getFileChiTiet } from "../store/maQR/service";
import {checkAccountSvc} from '../store/traodoi/services'
const ChiTietDaKi = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);
  const [mucDo, setMucDo] = useState(null);
  const nguoiDung = useSelector(nguoiDungSelector);
  const [sai, setSai] = useState(false);
  const [hople2, setHople2] = useState(false);

  useEffect(() => {
    const a = async () => {
      try {
        const res = await getFileChiTiet({ id: params?.id || "afbawf" });

        setSai(res.data?.data === null);
        if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
          const fileDaKy = res.data?.data?.kySoDeXuat?.fileDaKy;
          if (!!fileDaKy) {
            setMucDo(res.data?.data?.mucDo);

            // mucdo
            if(mucDo === 2) {
              const res_2 = await checkAccountSvc();
              console.log(res_2.data);
            }

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

  const link = "https://www.chukysoflames.com/";

  return (
    <>
      {!loading && (
        <>
          {!!url && (mucDo === 1 || (mucDo === 2 && !!nguoiDung)) && (
            <iframe
              style={{
                height: "100vh",
                width: "100vw",
              }}
              src={url}
              title="description"></iframe>
          )}

          {mucDo === 2 && !nguoiDung && (
            <div
              style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <div>
                <div className="text-center">
                  Bạn vui lòng đăng nhập trước khi quét mã
                </div>
                <div>
                  <Button
                    type="link"
                    onClick={() => {
                      window.open(link, "_SELF");
                    }}>
                    {link}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {(mucDo === 3 || sai) && <div
              style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Empty description="Không có dữ liệu" />
            </div>}
          {/* {url ? (
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
          )} */}
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
