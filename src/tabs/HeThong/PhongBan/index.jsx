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
} from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getDsPhongBanSvc,
  getDsUserPBSvc,
  sapXepDsPhongBanSvc,
  suaPhongBanSvc,
  themPhongBanSvc,
  xoaPhongBanSvc,
} from "../../../store/phongban/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import { ArrowLeftOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getDsNguoiDungSvc } from "../../../store/nguoidung/service";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TabContext } from "../../../layout/MainLayout";

export default () => {
  // const [state, dispatch] = useContext(TabContext);
  const [form] = Form.useForm();

  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [searchListUser, setSearchListUser] = useState([]);

  const [getListLoading, setGetListLoading] = useState(true);
  const [getListUserLoading, setGetListUserLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [sortListLoading, setSortListLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [userKeyword, setUserKeyWord] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [editText, setNewEditText] = useState("");

  const [anotherSelected, setAnotherSelected] = useState(null)

  const [isDetail, setIsDetail] = useState(false);

  function onDragEnd(result) {
    const dsThuTu = list.map((i) => i.thuTu);

    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(
      items.map((i, index) => {
        return { ...i, thuTu: dsThuTu[index] };
      }),
    );
  }

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getDsPhongBanSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(
          res.data?.data
            ?.filter((i) => i?.isDeleted === false)
            ?.map((i) => {
              return {
                maSo: i?.ma_PhongBan,
                tenPhongBan: i?.ten_PhongBan,
                thuTu: i?.order,
                key: i?.ma_PhongBan,
              };
            }),
        );
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleAdd = async (values) => {
    setAddLoading(true);
    try {
      const res = await themPhongBanSvc({ ten_PhongBan: values.tenPhongBan?.trim() });

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
      const res = await xoaPhongBanSvc({ id: item.maSo });

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
      const res = await suaPhongBanSvc({
        ma_PhongBan: selectedItem?.maSo,
        ten_PhongBan: editText?.trim(),
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

  const handleSort = async () => {
    setSortListLoading(true);
    try {
      const sortedList = list.map((item) => {
        return { id: item?.maSo, order: item?.thuTu };
      });

      const res = await sapXepDsPhongBanSvc(sortedList);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setSortListLoading(false);
    }
  };

  const handleSearchPB = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.tenPhongBan).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  const handleSearchUser = (keyword) => {
    setUserKeyWord(keyword);

    setSearchListUser(
      [...listUser].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.itemName).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  const handleGetListUser = async (id) => {
    setGetListUserLoading(true);
    try {
      const res = await getDsUserPBSvc({ id });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        console.log(res.data?.data)
        const list = res.data?.data?.nguoiDung_PhongBan?.map((i) => {
          return {
            maSo: i?.ma_NguoiDung,
            itemName: i?.ten_NguoiDung,
            key: i?.ma_NguoiDung,
            email: i?.email,
          };
        });

        setListUser(list);
      } else {
        //message.error(LOI);
      }
    } catch (error) {
      //message.error(LOI_HE_THONG);
    } finally {
      setGetListUserLoading(false);
    }
  };
  useEffect(() => {
    handleGetList();
  }, []);

  const columns_1 = [
    {
      title: "M?? s???",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "T??n ph??ng ban ",
      dataIndex: "tenPhongBan",
      key: "tenPhongBan",
    },
    {
      title: "Th??? t???",
      dataIndex: "thuTu",
      key: "thuTu",
    },
    {
      title: "H??nh ?????ng",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
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
                setIsDetail(true);
                handleGetListUser(record?.maSo);
                // setSelectedItem()
                setAnotherSelected(record)
              }}>
              Chi ti???t
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

  const columns_2 = [
    {
      title: "M?? s???",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "H??? v?? t??n",
      dataIndex: "itemName",
      key: "itemName",
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
        <Tabs.TabPane tab="Danh s??ch" key="1">
          {isSorting ? (
            <div>
              <div className="mt-2 mb-4 d-flex justify-content-end">
                <Button
                  type="link"
                  className="d-flex align-items-center"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    handleGetList();
                    setIsSorting(false);
                  }}>
                  Danh s??ch
                </Button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="listTitle">
                  {(provided) => (
                    <div
                      className="c-table"
                      {...provided.droppableProps}
                      ref={provided.innerRef}>
                      <div className="c-row">
                        <div className="c-data">STT</div>
                        <div className="flex-grow-1">T??n nh??m</div>
                        {/* <div className="c-data">Order</div> */}
                      </div>
                      {list.map(({ maSo, tenPhongBan, thuTu }, index) => {
                        return (
                          <Draggable
                            key={maSo?.toString()}
                            draggableId={maSo?.toString()}
                            index={index}>
                            {(provided) => (
                              <div
                                key={index}
                                className={`c-row ${
                                  index % 2 === 0 && "c-row-even"
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <div className="c-data">{index + 1}</div>
                                <div className="flex-grow-1">{tenPhongBan}</div>
                                {/* <div className="c-data">{thuTu}</div> */}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="d-flex justify-content-center mt-3">
                <Button
                  onClick={handleSort}
                  loading={sortListLoading}
                  type="primary">
                  S???p x???p
                </Button>
              </div>
            </div>
          ) : isDetail ? (
            <div>

              <div className="mt-2 mb-4 d-flex justify-content-between align-items-center">
                <div>T??n ph??ng ban: <span style={{color: 'blue'}}>{anotherSelected?.tenPhongBan}</span></div>


                <Input
                  style={{ width: 200 }}
                  placeholder="Nh???p t??? kho?? t??m ki???m"
                  value={userKeyword}
                  onChange={(e) => handleSearchUser(e.target.value)}
                />

                <Button
                  type="link"
                  className="d-flex align-items-center"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    handleGetList();
                    setIsDetail(false);
                  }}>
                  Danh s??ch
                </Button>
              </div>

              <Table
                loading={getListUserLoading}
                columns={columns_2}
                dataSource={userKeyword.trim() ? searchListUser : listUser}
                pagination={{ defaultPageSize: 10 }}
              />
            </div>
          ) : (
            <div style={{}}>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Input
                  style={{ width: 200 }}
                  placeholder="Nh???p t??? kho?? t??m ki???m"
                  value={keyword}
                  onChange={(e) => handleSearchPB(e.target.value)}
                />

                <Button type="primary" onClick={() => setIsSorting(true)}>
                  S???p x???p
                </Button>
              </div>
              <Table
                loading={getListLoading}
                columns={columns_1}
                dataSource={keyword.trim() ? searchList : list}
                pagination={{ defaultPageSize: 10 }}
              />
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Th??m ph??ng ban" key="2">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical">
            <Form.Item
              label="T??n ph??ng ban"
              name="tenPhongBan"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n ph??ng ban!",
                },
              ]}>
              <Input placeholder="Nh???p t??n ph??ng ban" />
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
        title="S???a ph??ng ban"
        open={modalEditVisible}
        confirmLoading={editLoading}
        okText="S???a"
        onOk={handleEdit}
        okButtonProps={{ disabled: !editText.trim() }}
        onCancel={() => {
          setModalEditVisible(false);
        }}>
        <Input value={selectedItem?.tenPhongBan} disabled />

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
