# Ghi chú nghiên cứu về Harness Engineering

Kho này lưu các ghi chú Markdown về **harness engineering** cho AI agent làm
việc dài hạn.

## Phạm vi nguồn

Chỉ dùng năm bài sau:

- `[S1]` OpenAI, "Harness engineering: leveraging Codex in an agent-first world".
- `[S2]` Anthropic, "Effective harnesses for long-running agents".
- `[S3]` Anthropic, "Building effective agents".
- `[S4]` Anthropic, "Harness design for long-running application development".
- `[S5]` Google DeepMind, "AutoHarness: Improving LLM Agents by Automatically Synthesizing a Code Harness" & Google Cloud agent engineering practices.

Không thêm resource, citation, paper, DOI, benchmark, hoặc blog khác nếu người
dùng chưa yêu cầu mở rộng phạm vi.

## Bản đồ tài liệu

- Đọc `README.md` trước để nắm mục tiêu và thứ tự đọc.
- Bản tổng hợp nghiên cứu chính nằm ở
  `docs/harness-engineering/research-note.md`.
- Hướng dẫn triển khai thực tế nằm ở
  `docs/harness-engineering/implementation-playbook.md`.
- Danh mục nguồn đã xác minh nằm ở `docs/harness-engineering/sources.md`.
- Skill thực hành tạo harness nằm ở `skills/creator-harness/SKILL.md`.

## Bắt đầu session

1. Đọc `README.md`, `progress.md`, và `feature_list.json`.
2. Xem lịch sử git gần nhất để nhận biết thay đổi đang tiếp tục.
3. Chạy `./init.sh` để kiểm tra baseline rẻ nhất trước khi sửa.
4. Chỉ cập nhật trạng thái feature sau khi lệnh verify liên quan pass.
5. Ghi kết quả kiểm chứng và bước tiếp theo vào `progress.md` khi task kéo dài.

## Lệnh chuẩn

- Smoke test đầu session: `./init.sh`.
- Kiểm thử package: `npm test`.
- Kiểm guardrail harness và test: `npm run verify`.
- Kiểm nội dung package xuất bản: `npm run pack:dry`.

## Quy tắc viết

- Mọi nhận định quan trọng phải truy vết được về `[S1]`, `[S2]`, `[S3]`, `[S4]`, hoặc
  `[S5]`.
- Không tự bịa citation, paper, tác giả, ngày tháng, DOI, benchmark, hoặc số
  liệu.
- Nếu chưa xác minh được nguồn, đánh dấu rõ bằng marker tiếng Việt cho nội
  dung cần xác minh.
- Viết theo phong cách nghiên cứu: luận điểm, bằng chứng, hệ quả.
- Phân biệt rõ đâu là kết luận từ nguồn và đâu là diễn giải của tài liệu này.

## Quy trình cập nhật

1. Đọc `docs/harness-engineering/sources.md`.
2. Cập nhật phần liên quan trong research note hoặc playbook.
3. Chỉ thêm nguồn mới nếu người dùng yêu cầu mở rộng ngoài năm bài.
4. Kiểm tra placeholder và citation ngoài phạm vi trước khi hoàn tất.

## Ràng buộc local

- Không chạy lệnh Xcode hoặc Android.
- Khi dùng shell trong repo này, prefix lệnh bằng `rtk` theo
  `/Users/${USER}/.codex/RTK.md`.
