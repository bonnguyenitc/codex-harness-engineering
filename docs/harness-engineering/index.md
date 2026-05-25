# Mục lục Harness Engineering

## Thứ tự đọc

1. `research-note.md` - bản tổng hợp khái niệm chính.
2. `implementation-playbook.md` - hướng dẫn triển khai harness trong repository.
3. `sources.md` - metadata nguồn và bản đồ bằng chứng.
4. `skills/creator-harness/SKILL.md` - skill thực hành để tạo harness tối thiểu.
5. `skills/acceptance-contract/SKILL.md` - skill chốt scope, tiêu chí done, và verification.
6. `skills/cleanup-harness/SKILL.md` - skill scope cleanup có trigger và rollback.

## Phạm vi

Tài liệu này nghiên cứu harness engineering qua năm bài:

- `[S1]` OpenAI, "Harness engineering: leveraging Codex in an agent-first world".
- `[S2]` Anthropic, "Effective harnesses for long-running agents".
- `[S3]` Anthropic, "Building effective agents".
- `[S4]` Anthropic, "Harness design for long-running application development".
- `[S5]` Google DeepMind, "AutoHarness: Improving LLM Agents by Automatically Synthesizing a Code Harness" & Google Cloud agent engineering practices.

Mọi nguồn khác đã bị loại khỏi narrative hiện tại để giữ trọng tâm đúng yêu cầu.

## Khung đọc nhanh

Harness engineering trả lời câu hỏi: môi trường nào giúp một agent tạo tiến
triển phần mềm dài hạn mà không phụ thuộc hoàn toàn vào trí nhớ hội thoại hoặc
tự đánh giá chủ quan?

Năm bài tạo thành một chuỗi logic:

1. `[S3]` đưa nguyên tắc nền: bắt đầu bằng giải pháp đơn giản nhất, phân biệt
   workflow với agent, và chỉ tăng complexity khi tradeoff đáng giá.
2. `[S2]` chỉ ra failure mode của agent dài hạn: mất context, làm quá rộng,
   đánh dấu xong sớm, và không kiểm thử đầu-cuối.
3. `[S4]` thêm cấu trúc planner-generator-evaluator để xử lý task ứng dụng dài,
   chất lượng chủ quan, và QA qua runtime.
4. `[S1]` mở rộng thành kỷ luật repository-level: tri thức trong repo, môi
   trường dễ đọc với agent, invariant cơ học, throughput, và cleanup.
5. `[S5]` bổ sung khả năng tự động hóa sinh lớp bọc thực thi (AutoHarness) và các phương pháp đánh giá vết chạy (Trajectory Evaluation) cùng LLM-as-a-judge.

## Luận điểm chính

1. Kỹ sư chuyển từ viết code tay sang thiết kế môi trường và feedback loop [S1].
2. State phải sống trong artifact bền vững như feature list, progress log,
   setup script, và git history [S2].
3. Harness chỉ nên phức tạp hơn khi failure mode thật biện minh cho chi phí
   latency, token, và lỗi tích lũy [S3].
4. Agent cần quan sát hành vi thật của hệ thống bằng browser, test, log, metric,
   trace, API, hoặc database state [S1], [S2], [S4].
5. Tự đánh giá của generator yếu; evaluator riêng có thể tạo phản hồi cụ thể
   hơn để generator sửa [S4].
6. Tài liệu không đủ để giữ kiến trúc; invariant nên được mã hóa bằng lint,
   structural test, CI, và cleanup [S1].
7. Khi quy tắc môi trường quá phức tạp để tự viết, có thể dùng mô hình tự động sinh lớp bọc bằng code (AutoHarness) và đánh giá vết chạy (Trajectory Evaluation) tự động [S5].

## Định nghĩa làm việc

Trong kho này, **harness** là lớp scaffold ngoài trọng số mô hình: prompt, state
file, tool, setup command, test, acceptance contract, evaluator, guardrail, log,
metric, trace, và quy trình cleanup giúp agent làm việc đáng tin hơn.
