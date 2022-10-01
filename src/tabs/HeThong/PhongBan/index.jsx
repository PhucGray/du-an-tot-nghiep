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

const { Search } = Input;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows,
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};

export default () => {
  const [form] = Form.useForm();

  const [getListLoading, setGetListLoading] = useState(true);
  const [themPBLoading, setThemPBLoading] = useState(false);
  const [sapXepListLoading, setSapXepListLoading] = useState(false);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const [keyword, setKeyword] = useState("");

  function onDragEnd(result) {
    if (!result.destination) return;
    const thuTuMoi = result.destination.index + 1;
    const thuTuCu = result.source.index + 1;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  }

  const fetchDsPhongBan = async () => {
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
    const sortedList = list.map((item, index) => {
      return {
        ma_PhongBan: item?.maSo,
        ten_PhongBan: item?.tenPhongBan,
        order: index + 1,
      };
    });

    setSapXepListLoading(true);
    try {
      const res = await sapXepDsPhongBanSvc(sortedList);

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
        fetchDsPhongBan();
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
    }
  };

  const onSearch = (keyword) => {
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
    fetchDsPhongBan();
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
            {/* <Button type="link">Xoá</Button> */}
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
            fetchDsPhongBan();
          }
        }}>
        <Tabs.TabPane tab="Danh sách" key="1">
          <div style={{}}>
            <div className="mt-2 mb-4">
              {/* <Search
                placeholder="Nhập từ khoá tìm kiếm"
                onSearch={(value) => {
                  console.log(value);
                }}
                onChange
                style={{
                  width: 200,
                }}
              /> */}
              <Input
                style={{ width: 200 }}
                placeholder="Nhập từ khoá tìm kiếm"
                value={keyword}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <Table
              loading={getListLoading}
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              columns={columns}
              dataSource={keyword.trim() ? searchList : list}
              pagination={{ defaultPageSize: 5 }}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Sắp xếp" key="2">
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

          <Button
            loading={sapXepListLoading}
            onClick={handleSapXepPhongBan}
            type="primary"
            htmlType="submit"
            className="submit-btn">
            Sắp xếp
          </Button>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thêm phòng ban" key="3">
          <Form
            form={form}
            className="form mx-auto mt-3"
            name="basic"
            initialValues={{
              remember: true,
            }}
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
