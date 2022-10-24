export const transformUser = (item) => {
  return {
    ...item,
    itemName: item?.nguoiDung?.hoTen,
    ma_NguoiDung: item?.nguoiDung?.ma_NguoiDung,
    hoTen: item?.nguoiDung?.hoTen,
    ten_ChucDanh: item?.nguoiDung?.chucDanh?.ten_ChucDanh,
    ngayChuKyHetHan: item?.ngayChuKyHetHan,
    isThongSo: item?.nguoiDung?.isThongSo,
    trangThai: item?.trangThai,
  };
};
