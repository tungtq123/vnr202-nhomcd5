# Nguồn và cách biên tập

Ngày kiểm tra: 09/11/2026. Tất cả ảnh bên dưới là tư liệu có sẵn từ nguồn xuất bản; không có ảnh do AI tạo. Dùng bản WebP để hiển thị; giữ file tải gốc để đối chiếu. Không tuyên bố ảnh/phim thuộc public domain hay đã được cấp phép thương mại.

## Ảnh

| File hiển thị | Nội dung / tác giả | Trang nguồn |
| --- | --- | --- |
| `dinh-doc-lap-1975.webp` | Xe tăng tiến vào Dinh Độc Lập trưa 30/4/1975. Trần Mai Hưởng / TTXVN. Xe trong ảnh là 846; không gán thành xe 390 húc cổng đầu tiên. Bản hiển thị lấy từ VietnamPlus, 1000×669. | https://www.vietnamplus.vn/tien-ve-sai-gon-nhung-ban-tin-buc-anh-mang-tinh-su-lieu-cua-ttxvn-post637191.vnp |
| `xe-tho-1954.webp` | Dân công dùng xe thồ chở gạo ra mặt trận Điện Biên Phủ, 1954. Trung tâm Lưu trữ quốc gia III / Cục Văn thư và Lưu trữ Nhà nước. | https://xaydungchinhsach.chinhphu.vn/nhung-hinh-anh-dac-biet-quy-hiem-ve-chien-dich-dien-bien-phu-119230507104433041.htm |
| `dien-bien-1954.webp` | Trên nóc hầm de Castries, tháng 5/1954, cùng kho lưu trữ. Không khẳng định ảnh ghi trực tiếp khoảnh khắc 17h30 ngày 7/5. Ảnh dự trữ, chưa dùng trong giao diện. | Cùng bài Chính phủ ở trên. |
| `kham-thien-1972.webp` | Phố Khâm Thiên bị B-52 ném bom tàn phá ngày 26/12/1972. TTXVN. | https://special.nhandan.vn/50namkyuckhamthien/index.html |
| `nguoi-dan-kham-thien.webp` | Người dân Khâm Thiên sau trận không kích đêm 26/12/1972. Chu Chí Thành / TTXVN. Ảnh dự trữ, chưa dùng trong giao diện. | Cùng bài Nhân Dân ở trên. |
| `paris-1973.webp` | Lễ ký chính thức Hiệp định Paris 27/1/1973. Tư liệu TTXVN. | https://vietnam.vnanet.vn/vietnamese/tin-tuc/ky-niem-40-nam-hiep-dinh-paris-41151.html |
| `video-dienbien.webp` | Ảnh giới thiệu chương trình Tự hào Điện Biên Phủ – Tự hào Việt Nam, VTV, 2024. Không gán làm ảnh ghi tại năm 1954. | https://vtv.vn/video/tu-hao-dien-bien-phu-tu-hao-viet-nam-674977.htm |

Các bảng ảnh đã được tải kiểm tra định dạng và kích thước. Ảnh Khâm Thiên/Paris/1975 dùng trong thẻ video là **ảnh bối cảnh**, không phải ảnh chụp màn hình video; alt và phần thông tin trình phát ghi rõ điều này. Bìa có chữ ở những video khác là bố cục HTML/CSS, không phải ảnh minh họa lịch sử.

## Nội dung lịch sử và video

Danh mục 16 nguồn lịch sử nằm trong `dist/data.mjs`; danh mục 7 video có trang nguồn và đường dẫn phát nằm trong `dist/assets/media.json`. Giao diện hiển thị liên kết theo từng sự kiện, từng đáp án, kho tư liệu và danh mục cuối trang. Nội dung được viết lại để tổng hợp phục vụ học tập, không chép toàn văn nguồn.

Các điểm biên tập cần giữ:

- Điện Biên Phủ 1954 thuộc cuộc kháng chiến chống Pháp, không phải một chiến dịch chống Mỹ.
- Giới tuyến quân sự theo bối cảnh Giơnevơ 1954 là tạm thời.
- Đồng khởi là phong trào trên nhiều địa bàn, Bến Tre 17/1/1960 là điểm tiêu biểu.
- Không mô tả Mậu Thân 1968 là toàn thắng ở mọi trận; phân biệt tác động chiến lược và tổn thất.
- 81 ngày đêm Thành cổ Quảng Trị là 28/6–16/9/1972. Lực lượng QĐND rút khỏi Thành cổ ngày 16/9; không ghi giữ Thành cổ toàn thắng.
- Phân biệt ngày ký Paris 27/1/1973 với Giơnevơ 1954.
- Ngày 30/4/1975 kết thúc chiến tranh; việc thống nhất về mặt nhà nước là tiến trình tiếp theo.
- Năm phát hành phim được ghi riêng với giai đoạn sự kiện.

Video không tải trước khi người xem mở trình phát. Không tự động phát hay tự bật âm thanh. Tư liệu nghe nhìn giữ quyền tác giả của đơn vị xuất bản. Đường dẫn ngoài có thể thay đổi; mỗi trình phát có liên kết trang gốc.

## Trình phát đã kiểm tra

Năm đường dẫn MP4 cũ của VTV trả HTTP 501 với cả GET Range và HEAD. Đã thay bằng các video chính thức có metadata YouTube oEmbed HTTP 200, tên kênh khớp, `playabilityStatus.status = OK` và `playableInEmbed = true` tại thời điểm kiểm tra:

| Video | Kênh | Ngày đăng | Trang nguồn |
| --- | --- | --- | --- |
| Điện Biên Phủ – Nhìn từ nước Pháp | VTV4, @VTV4go | 7/5/2024 | https://www.youtube.com/watch?v=OraI2rKcJC4 |
| Mậu Thân 1968 – Ngày ấy trong tuyến lửa | HTV Tin Tức, @HTVTinTức | 7/7/2023 | https://www.youtube.com/watch?v=-VPGVS0VKas |
| Tình báo góp phần làm nên Điện Biên Phủ trên không | VTV24, @vtv24 | 25/12/2024 | https://www.youtube.com/watch?v=ysS-HHHzRBw |
| 50 năm Hiệp định Paris | VTV24, @vtv24 | 27/1/2023 | https://www.youtube.com/watch?v=8hj7twvfkvw |
| 30/4/1975 – Khoảnh khắc tháng tư lịch sử | VTV24, @vtv24 | 29/4/2023 | https://www.youtube.com/watch?v=ecJSxFzvSKk |

Video Đồng khởi sử dụng URL nhúng có sẵn trong bài Cổng thông tin HĐND tỉnh Nghệ An. Video Ấp Bắc là MP4 công khai của chuyên trang Nhân vật – Sự kiện / TTXVN, trả HTTP 200 `video/mp4`. Không tải file phim (dung lượng 673 MB) vào dự án. Browser QA xác nhận giao diện mở/đóng video và liên kết dự phòng; chưa xác minh phát trọn vẹn các phim dài. Có thể tái lấy ảnh/metadata bằng `fetch-assets.py`, `fetch-media.py` rồi chạy `update-players.py` để áp dụng danh mục video đã sửa.
