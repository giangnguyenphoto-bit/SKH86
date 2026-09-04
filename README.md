# SHK 86 HRM — Mini Web App V1

Tên công ty: SHK 86
Địa chỉ: 186 Hồ Bún Xáng, Cần Thơ

## V1 đã có
- Dashboard theo vai trò demo: BGĐ / HR1 / HR2 / Trưởng bộ phận / Nhân sự
- Cấu trúc nhân sự, bộ phận, địa điểm
- GPS check-in/check-out, mặc định bán kính 50m
- Bắt buộc selfie trước khi chấm; ảnh chỉ lưu để HR kiểm tra
- Lưu dữ liệu localStorage, sẵn sàng offline-first
- Bảng công / giải trình / workflow duyệt mẫu
- Nghỉ phép
- Payroll mẫu cho lương tháng/ngày/giờ + phụ cấp/KPI/OT
- Chốt kỳ công
- Export JSON và CSV

## Lưu ý kỹ thuật quan trọng
1. Trình duyệt web/PWA không cung cấp API chuẩn để đọc SSID/BSSID WiFi trên mọi điện thoại. V1 có trường cấu hình WiFi nhưng kiểm tra WiFi thực tế cần native app/app wrapper hoặc một cơ chế backend/network phù hợp.
2. GPS phải chạy trên HTTPS (hoặc localhost). Vào Cấu hình -> Địa điểm -> Lấy tọa độ hiện tại để thiết lập tâm địa điểm thật.
3. Offline trong V1 dùng localStorage + Service Worker. Bản production nên chuyển hàng đợi offline sang IndexedDB và backend API, có chữ ký/số thứ tự sự kiện để chống sửa dữ liệu cục bộ.
4. Payroll hiện là khung demo. Công thức KPI, OT, thưởng/phạt, BHXH, thuế TNCN cần cấu hình nghiệp vụ chính thức trước khi dùng tính lương thật.

## Chạy thử
- Có thể mở index.html để xem UI.
- Để GPS/camera/service worker hoạt động ổn định, nên chạy bằng HTTPS hoặc localhost.
- Khi triển khai thật, backend + database PostgreSQL + object storage cho selfie + authentication/role ACL là bắt buộc.

## V2 — Tài khoản & phân quyền
- Màn hình đăng nhập.
- Cấp tài khoản mới.
- Khóa/mở khóa tài khoản.
- Phân quyền theo 5 vai trò: BGĐ, HR Cấp 1, HR Cấp 2, Trưởng bộ phận, Nhân sự.
- Session đăng nhập bằng sessionStorage cho bản demo.
- Ma trận quyền hiển thị trong module Tài khoản & quyền.
- Tài khoản demo:
  - admin / SHK86@123
  - hr1 / SHK86@123
  - hr2 / SHK86@123
  - manager / SHK86@123
  - nv001 / SHK86@123

### Cảnh báo production
Đây vẫn là bản prototype chạy phía trình duyệt. Không dùng mật khẩu lưu localStorage để vận hành thật. Production phải có backend xác thực, hash mật khẩu (Argon2/bcrypt), JWT/session server-side, refresh token, CSRF protection, rate limit, audit log và kiểm soát quyền ở server — không chỉ ở giao diện.
