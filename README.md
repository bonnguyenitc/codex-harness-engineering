# Codex Harness Engineering

Kho này là ghi chú nghiên cứu và playbook thực hành để thiết kế **harness cho
Codex** trong các công việc phần mềm dài hạn. Trọng tâm không phải là prompt dài
hơn, mà là môi trường repository giúp Codex hiểu mục tiêu, giữ trạng thái, quan
sát runtime, kiểm chứng kết quả, và tiếp tục qua nhiều phiên làm việc.

Phạm vi hiện tại được cố ý thu hẹp vào bốn bài viết nền tảng của OpenAI và
Anthropic. Không dùng nguồn mở rộng, danh sách tổng hợp, preprint, blog bên thứ
ba, hoặc benchmark ngoài bốn bài này trong bản hiện tại.

## Luận đề một câu

Harness engineering cho Codex là việc thiết kế môi trường vận hành quanh agent
để năng lực của mô hình trở thành tiến triển phần mềm có thể tiếp tục, quan sát,
kiểm chứng, và duy trì qua nhiều vòng làm việc [S1], [S2], [S3], [S4].

## Đóng góp của kho này

Kho này biến bốn nguồn thành một harness tối thiểu cho Codex:

1. Xác định vai trò mới của kỹ sư: con người đặt mục tiêu, tiêu chí, và feedback
   loop; Codex thực thi trong môi trường có thể đọc và kiểm chứng [S1].
2. Chuẩn hóa source of truth trong repo để Codex không phụ thuộc vào chat
   history: `AGENTS.md`, docs, skill, progress, test, và git history [S1], [S2].
3. Đưa ra playbook chọn lớp harness nhỏ nhất theo failure mode thay vì thêm
   planner, evaluator, hoặc orchestration mặc định [S3], [S4].
4. Cung cấp skill thực hành để tạo, chốt scope, verify, và cleanup harness trong
   công việc dài hạn của Codex [S1], [S2], [S4].

## Bốn nguồn duy nhất

| Mã | Nguồn | Vai trò trong harness cho Codex |
| --- | --- | --- |
| `[S1]` | OpenAI, "Harness engineering: leveraging Codex in an agent-first world" | Nền tảng chính cho repository-local knowledge, `AGENTS.md`, feedback loop, application legibility, invariant cơ học, throughput, và cleanup |
| `[S2]` | Anthropic, "Effective harnesses for long-running agents" | Mẫu state handoff cho agent dài hạn: feature list, progress file, setup, git history, và kiểm thử đầu-cuối |
| `[S3]` | Anthropic, "Building effective agents" | Nguyên tắc bắt đầu đơn giản, phân biệt workflow với agent, và chỉ tăng complexity khi tradeoff đáng giá |
| `[S4]` | Anthropic, "Harness design for long-running application development" | Planner-generator-evaluator, sprint contract, evaluator riêng, và QA runtime cho task ứng dụng dài |

## Bản đồ tài liệu

| File | Mục đích |
| --- | --- |
| `docs/harness-engineering/index.md` | Mục lục và thứ tự đọc |
| `docs/harness-engineering/research-note.md` | Bản tổng hợp nghiên cứu chính |
| `docs/harness-engineering/implementation-playbook.md` | Playbook triển khai harness cho repository |
| `docs/harness-engineering/sources.md` | Metadata và bản đồ bằng chứng cho bốn nguồn |
| `skills/creator-harness/SKILL.md` | Skill thực hành tạo harness tối thiểu |
| `skills/acceptance-contract/SKILL.md` | Skill chốt scope, tiêu chí done, và verification trước khi làm |
| `skills/cleanup-harness/SKILL.md` | Skill cleanup có trigger, acceptance criteria, và rollback |

## Cách dùng cho Codex

Khi bắt đầu một task trong repo phần mềm khác, dùng kho này như harness template:

1. Đọc `docs/harness-engineering/implementation-playbook.md` để chọn can thiệp
   nhỏ nhất theo failure mode.
2. Dùng `skills/acceptance-contract/SKILL.md` nếu task nhỏ cần scope và verify
   rõ.
3. Dùng `skills/creator-harness/SKILL.md` nếu repo chưa có harness tối thiểu cho
   Codex.
4. Dùng `skills/cleanup-harness/SKILL.md` khi throughput của Codex tạo drift,
   orphan, hoặc entropy cần cleanup định kỳ.
5. Chỉ thêm evaluator, planner, hoặc sprint contract khi task thật sự có scope
   dài, chất lượng chủ quan, hoặc runtime khó tự đánh giá.

## Kết luận cốt lõi

Từ bốn bài này, harness engineering cho Codex không nên được hiểu là thêm nhiều
agent mặc định. Nó là một lớp điều khiển gồm state bền vững, tool dễ đọc,
acceptance criteria, kiểm thử runtime, evaluator khi cần, guardrail cơ học, và
cleanup định kỳ.

Nguyên tắc thực dụng:

1. Bắt đầu bằng cấu trúc đơn giản nhất đủ giải quyết nhiệm vụ [S3].
2. Khi Codex mất context, ngoại hóa trạng thái vào file và git [S2].
3. Khi Codex không thấy lỗi, thêm công cụ quan sát như browser, log, metric,
   trace, hoặc test runtime [S1], [S2], [S4].
4. Khi Codex tự đánh giá quá lạc quan, tách generator khỏi evaluator [S4].
5. Khi throughput tạo drift, biến judgment lặp lại thành lint, test, rule, và
   cleanup có nhịp [S1].

## Quy tắc cập nhật

- Mọi nhận định quan trọng phải truy vết về một trong bốn nguồn `[S1]-[S4]`.
- Không thêm nguồn khác nếu chưa có yêu cầu mở rộng phạm vi.
- Nếu chưa xác minh được claim, dùng marker tiếng Việt cho nội dung cần xác minh
  thay vì suy đoán.
- Trước khi hoàn tất, quét placeholder và citation ngoài `[S1]-[S4]`.
