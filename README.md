# Dấu ấn hòa bình

Website tiếng Việt về 3 thập kỷ lịch sử Việt Nam 1945–1975 (từ sau Cách mạng tháng Tám đến thống nhất đất nước), gồm trang chủ Hero giới thiệu kèm trình phát video tổng quan 3 phút 10 giây, trang danh sách 12 chương chuyên đề và trang nội dung chi tiết từng chương.

## Chạy và kiểm tra

Không cần cài thư viện. Dùng Node.js 22 trở lên:

```sh
node server.mjs
node verify.mjs
```

Mở `http://127.0.0.1:5173`. Thư mục triển khai là `dist/`.

- `dist/index.html` & `dist/home.mjs`: trang chủ Hero (`Khám phá 12 chương`, `Xem lại video tổng quan`) và trình phát tổng quan 3 phút 10 giây (15 phân đoạn).
- `dist/danh-sach-chuong.html` & `dist/chapters.mjs`: trang chọn 12 chương chuyên đề (đã mở toàn bộ Chương 1–12) và mục Tóm tắt lịch sử cuộc chiến qua 6 đời Tổng thống Mỹ (1945–1975).
- `dist/chuong.html` & `dist/chapter.mjs`: trang đọc nội dung chi tiết từng chương theo `?c=N` kèm ảnh tư liệu và nguồn đối chiếu.
- `dist/data.mjs` & `dist/utils.mjs`: dữ liệu 25 slide tổng quan, danh mục 12 chương, 20 nguồn tài liệu xác thực và hàm tiện ích dùng chung.
- `dist/styles.css`: hệ thống màu giấy ngà / xanh than / đỏ trầm, kiểu chữ editorial (Playfair Display & Be Vietnam Pro) và thiết kế responsive.
- `SOURCES.md`: xuất xứ ảnh và nguyên tắc biên tập nội dung.
