import "../../../styles/tabs.scss";

import {
  Table,
  Tabs,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Modal,
  Transfer,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getDsVaiTroSvc,
  suaVaiTroSvc,
  themVaiTroSvc,
  xoaVaiTroSvc,
} from "../../../store/vaitro/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import {
  ArrowDownOutlined,
  DoubleLeftOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getDsQuyenSvc } from "../../../store/quyen/service";
import {
  getVaiTro_QuyenSvc,
  themVaiTro_QuyenSvc,
} from "../../../store/vaitro_quyen/service";

export default () => {
  const [form] = Form.useForm();

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [getListLoading, setGetListLoading] = useState(true);
  const [getSubListLoading, setGetSubListLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addSubLoading, setAddSubLoading] = useState(false);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [editText, setNewEditText] = useState("");

  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [finalKeys, setFinalKeys] = useState([]);
  const [isShowTransfer, setIsShowTransfer] = useState(false);

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getDsVaiTroSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const list = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_Role,
              itemName: i?.ten_Role,
              key: i?.ma_Role,
            };
          });

        setList(list);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleGetSubList = async (id = -1) => {
    setGetSubListLoading(true);

    try {
      const res = await getDsQuyenSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const subList = res.data?.data
          ?.filter((i) => i?.isdeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_Quyen,
              itemName: i?.ten_Quyen,
              key: i?.ma_Quyen,
            };
          });

        const res_2 = await getVaiTro_QuyenSvc({ id });

        if (
          res_2.status === SUCCESS &&
          res_2.data?.retCode === RETCODE_SUCCESS
        ) {
          const selectedList = res_2.data?.data;
          setSubList(subList);
          getTransferData(subList, selectedList);
        }
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetSubListLoading(false);
    }
  };

  const handleAdd = async (values) => {
    setAddLoading(true);
    try {
      const res = await themVaiTroSvc({ ten_Role: values.itemName?.trim() });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields();
      } else {
        message.error(res.data?.retText);
        
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      const res = await xoaVaiTroSvc({ id: item.maSo });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
    }
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await suaVaiTroSvc({
        ma_Role: selectedItem?.maSo,
        ten_Role: editText?.trim(),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
        setModalEditVisible(false);
        setNewEditText('')
      } else {
        message.error(res.data?.retText);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.itemName).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  const getTransferData = (list, selectedList = []) => {
    const targetKeys = [];
    const selectedKeys = [];
    const transferData = [];

    for (let i = 0; i < list.length - 1; i++) {
      const item = list[i];

      const data = {
        key: item?.key,
        title: item?.itemName,
        chosen: selectedList.find((i) => i?.ma_Quyen === item?.key),
      };

      if (!data.chosen) {
        targetKeys.push(data.key);
      }
      transferData.push(data);
    }

    setTransferData(transferData);
    setTargetKeys(targetKeys);
  };

  const handleTransfer = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
    setFinalKeys(
      transferData
        .filter((i) => !newTargetKeys?.includes(i?.key))
        .map((i) => i.key),
    );
  };

  const handleAddVaiTro_Quyen = async () => {
    setAddSubLoading(true);

    try {
      const res = await themVaiTro_QuyenSvc({
        id_Role: selectedItem?.maSo,
        quyens: finalKeys.map((item) => {
          return {
            id_Quyen: item,
          };
        }),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setAddSubLoading(false);
    }
  };

  useEffect(() => {
    handleGetList();
  }, []);

  const columns = [
    {
      title: "M?? s???",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "T??n vai tr??",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "H??nh ?????ng",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            {/* <Button type="link">Chi ti???t</Button> */}
            <Button
              onClick={() => {
                setSelectedItem(record);
                setModalEditVisible(true);
              }}
              type="link">
              S???a
            </Button>
            <Button
              type="link"
              onClick={() => {
                setSelectedItem(record);
                setIsShowTransfer(true);
                handleGetSubList(record?.maSo);
              }}>
              Ph??n quy???n
            </Button>
            <Popconfirm
              title="B???n c?? ch???c ch???n mu???n xo???"
              onConfirm={() => handleDelete(record)}
              okText="?????ng ??"
              cancelText="Tho??t">
              <Button type="link">Xo??</Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="vai-tro">
      <Tabs
        defaultActiveKey="1"
        style={{ width: "95%", marginInline: "auto" }}
        onChange={(activeKey) => {
          if (activeKey == 1) {
            handleGetList();
          }
        }}>
        <Tabs.TabPane tab={isShowTransfer ? "Ph??n quy???n" : "Danh s??ch"} key="1">
          {isShowTransfer ? (
            <div>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <div>Vai tr?? hi???n t???i: <span style={{color: 'blue', fontWeight: 'bold'}}>{selectedItem?.itemName}</span></div>


                <Button
                  type="link"
                  className="d-flex align-items-center"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    handleGetList();
                    setIsShowTransfer(false);
                  }}>
                  Danh s??ch
                </Button>

              </div>

              {getSubListLoading ? (
                <div className="d-flex justify-content-center">
                  <Spin className="mt-4 mb-3" />
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center mt-2">
                  <div className="d-flex align-items-center justify-content-center gap-5">
                    <div>Quy???n ???? c??</div>
                    <DoubleLeftOutlined />
                    <div>Quy???n ch??a c??</div>
                  </div>

                  <Transfer
                    dataSource={transferData}
                    listStyle={{
                      width: 250,
                      height: 350,
                      marginTop: 10,
                    }}
                    targetKeys={targetKeys}
                    onChange={handleTransfer}
                    render={(item) => `${item.title}`}
                  />

                  <Button
                    type="primary"
                    className="mt-3"
                    loading={addSubLoading}
                    onClick={handleAddVaiTro_Quyen}>
                    X??c nh???n
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{}}>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Input
                  style={{ width: 200 }}
                  placeholder="Nh???p t??? kho?? t??m ki???m"
                  value={keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Table
                loading={getListLoading}
                columns={columns}
                dataSource={keyword.trim() ? searchList : list}
                pagination={{ defaultPageSize: 10 }}
              />
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Th??m vai tr??" key="2">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical">
            <Form.Item
              label="T??n vai tr??"
              name="itemName"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n vai tr??!",
                },
              ]}>
              <Input placeholder="Nh???p t??n vai tr??" />
            </Form.Item>

            <Button
              loading={addLoading}
              type="primary"
              htmlType="submit"
              className="submit-btn">
              Th??m
            </Button>
          </Form>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="S???a vai tr??"
        open={modalEditVisible}
        confirmLoading={editLoading}
        okText="S???a"
        onOk={handleEdit}
        okButtonProps={{ disabled: !editText.trim() }}
        onCancel={() => {
          setModalEditVisible(false);
        }}>
        <Input value={selectedItem?.itemName} disabled />

        <div className="text-center mb-3 mt-2">
          <ArrowDownOutlined />
        </div>

        <Input
          autoFocus
          value={editText}
          onChange={(e) => setNewEditText(e.target.value)}
        />
      </Modal>
    </div>
  );
};
