# Harness Engineering

Kho này là ghi chú nghiên cứu về **harness engineering** cho AI agent làm việc
dài hạn. Phạm vi hiện tại được cố ý thu hẹp vào bốn bài viết nền tảng của
OpenAI và Anthropic.

## Luận đề một câu

Harness engineering là việc thiết kế môi trường vận hành quanh agent để năng
lực của mô hình trở thành tiến triển có thể tiếp tục, quan sát, kiểm chứng, và
duy trì qua nhiều vòng làm việc.

## Bốn nguồn duy nhất

| Mã | Nguồn | Vai trò |
| --- | --- | --- |
| `[S1]` | OpenAI, "Harness engineering: leveraging Codex in an agent-first world" | Đặt tên kỷ luật harness engineering ở quy mô repository agent-first |
| `[S2]` | Anthropic, "Effective harnesses for long-running agents" | Mô tả harness cho agent dài hạn qua nhiều context window |
| `[S3]` | Anthropic, "Building effective agents" | Đặt nguyên tắc đơn giản trước, chỉ tăng complexity khi cần |
| `[S4]` | Anthropic, "Harness design for long-running application development" | Mở rộng sang planner, generator, evaluator, sprint contract, và QA |

Không dùng nguồn mở rộng, danh sách tổng hợp, preprint, blog bên thứ ba, hoặc
benchmark ngoài bốn bài trên trong bản hiện tại.

## Bản đồ tài liệu

| File | Mục đích |
| --- | --- |
| `docs/harness-engineering/index.md` | Mục lục và thứ tự đọc |
| `docs/harness-engineering/research-note.md` | Bản tổng hợp nghiên cứu chính |
| `docs/harness-engineering/implementation-playbook.md` | Playbook triển khai thực tế |
| `docs/harness-engineering/sources.md` | Metadata và bản đồ bằng chứng cho bốn nguồn |
| `skills/creator-harness/SKILL.md` | Skill thực hành tạo harness tối thiểu |
| `skills/acceptance-contract/SKILL.md` | Skill chốt scope, tiêu chí done, và verification trước khi làm |
| `skills/cleanup-harness/SKILL.md` | Skill scope cleanup có trigger, acceptance criteria, và rollback |

## Kết luận cốt lõi

Từ bốn bài này, harness engineering không nên được hiểu là prompt dài hơn hay
thêm nhiều agent mặc định. Nó là một lớp điều khiển gồm state bền vững, tool dễ
đọc, acceptance criteria, kiểm thử runtime, evaluator khi cần, guardrail cơ học,
và cleanup định kỳ.

Nguyên tắc thực dụng:

1. Bắt đầu bằng cấu trúc đơn giản nhất đủ giải quyết nhiệm vụ [S3].
2. Khi agent mất context, ngoại hóa trạng thái vào file và git [S2].
3. Khi agent không thấy lỗi, thêm công cụ quan sát như browser, log, metric,
   trace, hoặc test runtime [S1], [S2], [S4].
4. Khi agent tự đánh giá quá lạc quan, tách generator khỏi evaluator [S4].
5. Khi throughput tạo drift, biến judgment lặp lại thành lint, test, rule, và
   cleanup có nhịp [S1].

## Quy tắc cập nhật

- Mọi nhận định quan trọng phải truy vết về một trong bốn nguồn `[S1]-[S4]`.
- Không thêm nguồn khác nếu chưa có yêu cầu mở rộng phạm vi.
- Nếu chưa xác minh được claim, dùng marker tiếng Việt cho nội dung cần xác
  minh thay vì suy đoán.
- Trước khi hoàn tất, quét placeholder và mã nguồn ngoài `[S1]-[S4]`.
