# Dấu ấn hòa bình

Website tiếng Việt về lịch sử Việt Nam 1954–1975: sáu chặng, bảy video và mười hai câu hỏi ôn tập, kết hợp chiến thắng với ký ức về tổn thất chiến tranh.

## Chạy và kiểm tra

Không cần cài thư viện. Dùng Node.js 22 trở lên:

```sh
node server.mjs
node verify.mjs
```

Mở `http://127.0.0.1:5173`. Thư mục triển khai là `dist/`; cấu hình Sites nằm trong `.openai/hosting.json`.

- `dist/index.html`: cấu trúc nội dung và các mục tĩnh.
- `dist/styles.css`: hệ thống màu, chữ, bố cục và thiết kế responsive.
- `dist/data.mjs`: chặng lịch sử, nguồn, video và câu hỏi.
- `dist/app.mjs`: chọn chặng, lọc tư liệu, trình phát và chấm điểm.
- `dist/assets/media.json`: metadata trình phát được trích từ trang nguồn.
- `SOURCES.md`: xuất xứ ảnh và nguyên tắc nội dung.

Giao diện sử dụng Playfair Display và Be Vietnam Pro từ Google Fonts, có font hệ thống dự phòng. Các mốc lịch sử và giải thích được tổng hợp từ nguồn dẫn trong từng chặng. Không dùng ảnh AI.

## Lựa chọn triển khai

Trang tĩnh HTML/CSS/JavaScript không cần thư viện hay bước biên dịch. Starter Vinext của Sites đã được chuẩn bị nhưng trình quản lý gói của máy chưa có cấu hình tin cậy để chạy; bản gốc được giữ nguyên trong `starter-reference/` (bỏ qua trong Git). Website hoàn chỉnh chạy độc lập với starter.

Video được phát từ máy chủ nguồn hoặc trình nhúng YouTube được lấy từ trang cơ quan đăng tải; không sao chép file phim vào dự án. Nút mở trang gốc luôn có sẵn khi đơn vị xuất bản thay đổi đường dẫn hoặc giới hạn phát. Kết quả bài ôn tập toàn bộ chỉ lưu tại trình duyệt, không có máy chủ thu thập dữ liệu.

## Thiết kế

Đã dùng skill ui-ux-pro-max với truy vấn `history museum editorial archive`. Kết quả phù hợp: kể chuyện theo chặng, hệ thống bố cục có lưới, kiểu chữ editorial và tương phản cao. Hướng mỹ thuật được điều chỉnh cho nội dung lịch sử: giấy ngà, xanh than, đỏ trầm; ảnh tư liệu đi kèm chú thích; không tự động phát phim, không chuyển động nền.

Hỗ trợ menu điện thoại, bàn phím cho tab dòng thời gian, focus rõ, hộp thoại native có Escape, liên kết bỏ qua điều hướng và tùy chọn giảm chuyển động của hệ thống.
