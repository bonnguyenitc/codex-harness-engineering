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
4. Khi task thay đổi hành vi, guardrail, package, script, test, skill, hoặc
   quy tắc agent, chỉ đánh dấu feature đã verify sau khi lệnh kiểm tra liên quan
   pass.
5. Với các thay đổi ở mục 4, luôn cập nhật `feature_list.json` và `progress.md`
   trước khi hoàn tất, kể cả task nhỏ. Chỉ task chỉnh nội dung nghiên cứu thuần
   túy mới có thể chỉ ghi `progress.md` khi kéo dài. Mục `Relevant files` trong
   entry mới nhất của progress phải liệt kê các artifact hành vi đã đổi.

## Lệnh chuẩn

- Smoke test đầu session: `./init.sh`.
- Kiểm thử package: `npm test`.
- Kiểm guardrail harness và test: `npm run verify`.
- Kiểm nội dung package xuất bản: `npm run pack:dry`.
- `npm run verify` phải fail nếu working tree có thay đổi hành vi harness mà
  thiếu cập nhật `feature_list.json` hoặc `progress.md`.

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
