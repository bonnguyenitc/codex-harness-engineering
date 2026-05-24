# Nguồn

File này chỉ theo dõi bốn nguồn được phép dùng trong bản nghiên cứu hiện tại.
Không thêm claim vào tài liệu nếu claim đó không ánh xạ tới một trong bốn nguồn
này hoặc không được đánh dấu rõ là diễn giải.

## Danh mục nguồn

### [S1] OpenAI

- Tiêu đề: "Harness engineering: leveraging Codex in an agent-first world"
- Tác giả: Ryan Lopopolo
- Ngày xuất bản: 11 tháng 2, 2026
- URL: https://openai.com/index/harness-engineering/
- Dùng cho:
  - framing "humans steer, agents execute";
  - harness engineering như thiết kế environment, intent specification, và
    feedback loop quanh Codex;
  - repository knowledge base như system of record;
  - `AGENTS.md` như bản đồ, không phải cẩm nang khổng lồ;
  - ưu tiên dependency, abstraction, và thông tin mà agent có thể inspect,
    validate, và modify trực tiếp trong repo;
  - application, browser, log, metric, và trace như tín hiệu agent đọc được;
  - progressive disclosure cho tri thức trong repo và kiểm tra cơ học về
    freshness/cross-link để giảm drift của tài liệu;
  - cưỡng chế architecture và taste bằng lint, structural test, và custom rule;
  - throughput, merge philosophy, autonomy, entropy, và cleanup định kỳ;
  - cảnh báo rằng mức tự chủ phụ thuộc vào cấu trúc và tooling cụ thể của repo.

### [S2] Anthropic

- Tiêu đề: "Effective harnesses for long-running agents"
- Tác giả: Justin Young
- Ngày xuất bản: 26 tháng 11, 2025
- URL: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Dùng cho:
  - failure mode của agent qua nhiều context window;
  - initializer agent và coding agent;
  - feature list dạng JSON với trạng thái pass/fail;
  - tiến triển từng feature thay vì làm quá rộng;
  - progress file, git commit, và `init.sh`;
  - kiểm thử đầu-cuối bằng browser automation;
  - vòng bắt đầu session: đọc progress, feature list, git log, setup, smoke test.

### [S3] Anthropic

- Tiêu đề: "Building effective agents"
- Tác giả: Erik Schluntz và Barry Zhang
- Ngày xuất bản: 19 tháng 12, 2024
- URL: https://www.anthropic.com/engineering/building-effective-agents
- Dùng cho:
  - phân biệt workflow định tuyến sẵn và agent tự điều khiển process/tool;
  - nguyên tắc bắt đầu bằng giải pháp đơn giản nhất;
  - tradeoff giữa performance, latency, cost, và complexity;
  - building block "augmented LLM" với retrieval, tool, và memory;
  - workflow pattern như prompt chaining, routing, parallelization,
    orchestrator-workers, evaluator-optimizer;
  - thiết kế agent-computer interface và tool definition dễ dùng.

### [S4] Anthropic

- Tiêu đề: "Harness design for long-running application development"
- Tác giả: Prithvi Rajasekaran
- Ngày xuất bản: 24 tháng 3, 2026
- URL: https://www.anthropic.com/engineering/harness-design-long-running-apps
- Dùng cho:
  - vấn đề context anxiety và self-evaluation;
  - tách generator khỏi evaluator;
  - grading criteria để làm chất lượng chủ quan dễ chấm hơn;
  - planner-generator-evaluator cho phát triển ứng dụng dài hạn;
  - sprint contract giữa generator và evaluator;
  - QA bằng Playwright qua UI, API, database state, và hành vi runtime;
  - chi phí, độ trễ, và token cost của harness phức tạp;
  - nguyên tắc xem lại harness khi model mới làm một số lớp orchestration không
    còn load-bearing.

## Bản đồ bằng chứng

| Nhận định | Nguồn |
| --- | --- |
| Harness engineering chuyển trọng tâm kỹ sư từ viết code tay sang thiết kế môi trường, intent, và feedback loop. | [S1] |
| Repository-local knowledge giúp agent truy cập quyết định, quy tắc, và trạng thái mà không phụ thuộc chat history. | [S1] |
| `AGENTS.md` nên là bản đồ ngắn trỏ tới nguồn sự thật sâu hơn, không phải một manual khổng lồ. | [S1] |
| Chọn dependency và abstraction nên tính đến việc agent có thể inspect, validate, và modify chúng trực tiếp; hành vi opaque ở upstream làm giảm leverage. | [S1] |
| Agent cần application legibility: UI, log, metric, trace, và môi trường dev có thể quan sát được. | [S1] |
| Repository knowledge nên theo progressive disclosure và có kiểm tra cơ học cho freshness/cross-link; doc-gardening định kỳ giúp giảm drift của source of truth. | [S1] |
| Documentation đơn thuần không đủ; architecture và taste nên được cưỡng chế bằng lint, structural test, và custom rule. | [S1] |
| Throughput cao làm entropy tích lũy nhanh, nên cleanup định kỳ là một phần của harness. | [S1] |
| Agent dài hạn dễ mất context giữa các session và cần externalized state. | [S2] |
| Feature list, progress file, git history, và `init.sh` giúp session mới phục hồi trạng thái. | [S2] |
| Feature list dạng JSON giúp agent giữ trạng thái feature có cấu trúc và cập nhật pass/fail nhất quán qua nhiều session. | [S2] |
| Git commit mô tả rõ và progress update không chỉ để audit; chúng còn tạo checkpoint để agent revert thay đổi xấu và khôi phục working state sạch hơn. | [S2] |
| Làm từng feature và chỉ đánh dấu pass sau kiểm thử giúp giảm tuyên bố hoàn thành sớm. | [S2] |
| Browser automation giúp agent phát hiện lỗi không thấy được từ code hoặc unit test đơn lẻ. | [S2] |
| Agentic system nên bắt đầu bằng giải pháp đơn giản nhất và chỉ tăng complexity khi cần. | [S3] |
| Workflow phù hợp với task có đường đi định sẵn; agent phù hợp khi cần model tự quyết định tool/process. | [S3] |
| Tool nên được thiết kế như agent-computer interface với mô tả, tham số, ranh giới, và ví dụ rõ. | [S3] |
| Generator tự đánh giá thường quá tích cực; evaluator riêng dễ được chỉnh thành hoài nghi hơn. | [S4] |
| Sprint contract giúp generator và evaluator đồng thuận về phạm vi, tiêu chí done, và phương thức QA. | [S4] |
| Context reset có thể là một phần chủ đích của harness; nếu state handoff đủ tốt, reset giúp giữ model bám task thay vì trượt theo context anxiety. | [S4] |
| Harness phức tạp có thể tốn nhiều giờ và token, nên phải được xem là tradeoff thay vì mặc định. | [S4] |
| Khi model mới xuất hiện, nên xem lại và loại bỏ các phần harness không còn tạo giá trị. | [S4] |

## Chính sách citation

- Chỉ dùng mã `[S1]`, `[S2]`, `[S3]`, `[S4]`.
- Không thêm citation, paper, DOI, benchmark, hoặc blog ngoài phạm vi nếu chưa
  được yêu cầu.
- Nếu mở rộng phạm vi sau này, phải cập nhật file này trước rồi mới cập nhật
  `research-note.md` hoặc `implementation-playbook.md`.
