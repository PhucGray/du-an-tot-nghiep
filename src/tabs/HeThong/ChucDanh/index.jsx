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
  getDsChucDanhSvc,
  sapXepDsChucDanhSvc,
  suaChucDanhSvc,
  themChucDanhSvc,
  xoaChucDanhSvc,
} from "../../../store/chucdanh/service";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../constants/api";
import { toLowerCaseNonAccentVietnamese } from "../../../utils/strings";
import { ArrowLeftOutlined, ArrowDownOutlined } from "@ant-design/icons";

export default () => {
  const [form] = Form.useForm();

  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [getListLoading, setGetListLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [sortListLoading, setSortListLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [editText, setNewEditText] = useState("");

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
      const res = await getDsChucDanhSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        setList(
          res.data?.data
            ?.filter((i) => i?.isDeleted === false && i?.ma_ChucDanh !== 1)
            ?.map((i) => {
              return {
                maSo: i?.ma_ChucDanh,
                tenChucDanh: i?.ten_ChucDanh,
                thuTu: i?.order,
                key: i?.ma_ChucDanh,
                thuocVe: i?.nguoiDung?.[0]?.hoTen || null,
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
      const res = await themChucDanhSvc({
        ten_ChucDanh: values.tenChucDanh?.trim(),
      });

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
      const res = await xoaChucDanhSvc({ id: item.maSo });

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
      const res = await suaChucDanhSvc({
        ma_ChucDanh: selectedItem?.maSo,
        ten_ChucDanh: editText?.trim(),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetList();
        setModalEditVisible(false);
        setNewEditText("");
      } else {
        //message.error(LOI);
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

      const res = await sapXepDsChucDanhSvc(sortedList);

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

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.tenChucDanh).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
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
      title: "T??n ch???c danh ",
      dataIndex: "tenChucDanh",
      key: "tenChucDanh",
    },
    {
      title: "Thu???c v???",
      dataIndex: "thuocVe",
      key: "thuocVe",
      render: (_, record) => <div>{_ ? <div>{_}</div> : <div style={{color: 'orange'}}>Ch??a c??</div>}</div>,
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
            {/* <Button type="link">Chi ti???t</Button> */}
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
                      {list.map(({ maSo, tenChucDanh, thuTu }, index) => {
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
                                <div className="flex-grow-1">{tenChucDanh}</div>
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
          ) : (
            <div style={{}}>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Input
                  style={{ width: 200 }}
                  placeholder="Nh???p t??? kho?? t??m ki???m"
                  value={keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                <Button type="primary" onClick={() => setIsSorting(true)}>
                  S???p x???p
                </Button>
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

        <Tabs.TabPane tab="Th??m ch???c danh" key="2">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical">
            <Form.Item
              label="T??n ch???c danh"
              name="tenChucDanh"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n ch???c danh!",
                },
              ]}>
              <Input placeholder="Nh???p t??n ch???c danh" />
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
        title="S???a ch???c danh"
        open={modalEditVisible}
        confirmLoading={editLoading}
        okText="S???a"
        onOk={handleEdit}
        okButtonProps={{ disabled: !editText.trim() }}
        onCancel={() => {
          setModalEditVisible(false);
        }}>
        <Input value={selectedItem?.tenChucDanh} disabled />

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
