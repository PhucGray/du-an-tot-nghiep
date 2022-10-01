import "../../../styles/tabs.scss";

import { Table, Tabs, Button, Form, Input, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getDsPhongBanSvc,
  sapXepDsPhongBanSvc,
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
import { ArrowLeftOutlined } from "@ant-design/icons";

export default () => {
  const [form] = Form.useForm();

  const [getListLoading, setGetListLoading] = useState(true);
  const [themPBLoading, setThemPBLoading] = useState(false);
  const [sapXepListLoading, setSapXepListLoading] = useState(false);
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isSorting, setIsSorting] = useState(false);

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

  const handleGetDsPhongBan = async () => {
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
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleThemPhongBan = async (values) => {
    setThemPBLoading(true);
    try {
      const res = await themPhongBanSvc({ ten_PhongBan: values.tenPhongBan });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        form.resetFields(["tenPhongBan"]);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setThemPBLoading(false);
    }
  };

  const handleSapXepPhongBan = async () => {
    setSapXepListLoading(true);
    try {
      const res = await sapXepDsPhongBanSvc(list);

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setSapXepListLoading(false);
    }
  };

  const handleXoaPhongBan = async (phongBan) => {
    try {
      const res = await xoaPhongBanSvc({ id: phongBan.maSo });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
        handleGetDsPhongBan();
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
    }
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.tenPhongBan).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  useEffect(() => {
    handleGetDsPhongBan();
  }, []);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Tên phòng ban ",
      dataIndex: "tenPhongBan",
      key: "tenPhongBan",
    },
    {
      title: "Thứ tự",
      dataIndex: "thuTu",
      key: "thuTu",
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            <Button type="link">Sửa</Button>
            <Button type="link">Chi tiết</Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá?"
              onConfirm={() => handleXoaPhongBan(record)}
              // onCancel={cancel}
              okText="Đồng ý"
              cancelText="Thoát">
              <Button type="link">Xoá</Button>
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
            handleGetDsPhongBan();
          }
        }}>
        <Tabs.TabPane tab="Danh sách" key="1">
          {isSorting ? (
            <div>
              <div className="mt-2 mb-4 d-flex justify-content-end">
                <Button
                  type="link"
                  className="d-flex align-items-center"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    handleGetDsPhongBan();
                    setIsSorting(false);
                  }}>
                  Danh sách
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
                        {/* <div className="c-data">Mã số</div> */}
                        <div className="flex-grow-1">Tên nhóm</div>
                        <div className="c-data">Order</div>
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
                                {/* <div className="c-data">{maSo}</div> */}
                                <div className="flex-grow-1">{tenPhongBan}</div>
                                <div className="c-data">{thuTu}</div>
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
                <Button type="primary">Sắp xếp</Button>
              </div>
            </div>
          ) : (
            <div style={{}}>
              <div className="mt-2 mb-4 d-flex justify-content-between">
                <Input
                  style={{ width: 200 }}
                  placeholder="Nhập từ khoá tìm kiếm"
                  value={keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                <Button type="primary" onClick={() => setIsSorting(true)}>
                  Sắp xếp
                </Button>
              </div>
              <Table
                loading={getListLoading}
                columns={columns}
                dataSource={keyword.trim() ? searchList : list}
                pagination={{ defaultPageSize: 5 }}
              />
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thêm phòng ban" key="2">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            onFinish={handleThemPhongBan}
            autoComplete="off"
            layout="vertical">
            <Form.Item
              label="Tên phòng ban"
              name="tenPhongBan"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên phòng ban!",
                },
              ]}>
              <Input placeholder="Nhập tên phòng ban" />
            </Form.Item>

            <Button
              loading={themPBLoading}
              type="primary"
              htmlType="submit"
              className="submit-btn">
              Thêm
            </Button>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
