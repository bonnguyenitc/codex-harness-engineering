# Playbook triển khai harness

Playbook này chuyển bốn bài OpenAI/Anthropic thành quy trình thiết kế harness
cho repository phần mềm.

## Giả định

- Repository là nguồn sự thật vận hành.
- Bắt đầu bằng harness nhỏ nhất làm thay đổi hành vi agent.
- "Done" nghĩa là có bằng chứng kiểm chứng được.
- Con người đặt mục tiêu, ràng buộc, và tiêu chí; agent thực thi trong môi
  trường có state, tool, feedback, và guardrail.

## Cây quyết định

Áp dụng từ ít phức tạp đến nhiều phức tạp.

| Tín hiệu | Can thiệp tối thiểu | Nguồn |
| --- | --- | --- |
| Task nhỏ, test rõ | Agent đơn lẻ + acceptance criteria + lệnh verify | [S3] |
| Task vượt một context | Feature list, progress log, git history, `init.sh` | [S2] |
| Agent không biết chạy app | Setup script idempotent + smoke test đầu session | [S2] |
| Code pass nhưng hành vi runtime fail | Browser/API/log/metric/trace check | [S1], [S2] |
| Agent tự đánh giá quá lạc quan | Evaluator riêng + feedback cụ thể | [S4] |
| Prompt mơ hồ hoặc app nhiều luồng | Planner + sprint contract + generator/evaluator | [S4] |
| Throughput tạo drift kiến trúc | Lint, structural test, CI rule, cleanup định kỳ | [S1] |

Nếu không có failure mode cụ thể, chưa thêm lớp harness đó.

## Harness tối thiểu

Một repository chưa có harness nên bắt đầu bằng:

| Artifact | Mục đích | Nguồn |
| --- | --- | --- |
| `AGENTS.md` | Entry point ngắn: đọc gì, chạy gì, tránh gì | [S1] |
| `README.md` | Mục tiêu dự án và lệnh cơ bản | [S1] |
| `init.sh` hoặc lệnh setup | Khôi phục môi trường ở session mới | [S2] |
| `feature_list.json` | Danh sách feature và trạng thái pass/fail | [S2] |
| `progress.md` | Việc đã làm, verify đã chạy, việc tiếp theo | [S2] |
| Git commit nhỏ, mô tả rõ | Checkpoint để session sau đọc lại hoặc revert khi cần | [S2] |
| Task runner | Lệnh chuẩn cho setup/test/lint/build/smoke | [S2], [S3] |
| Test hoặc smoke test | Bằng chứng tối thiểu trước và sau sửa | [S2], [S3] |

Không thêm planner, evaluator, telemetry stack, hoặc cleanup automation nếu
chưa có failure mode yêu cầu.

Nếu phải chọn giữa prose thuần và state có cấu trúc cho tiến độ feature, ưu
tiên dạng như `feature_list.json`: session mới dễ chọn một feature, giữ trạng
thái pass/fail nhất quán, và tránh suy diễn lại từ ghi chú tự do [S2].

## Phân tầng nguồn sự thật

Giữ artifact ngắn, đúng vai, và dễ quét trong session mới.

| Artifact | Nên chứa | Không nên chứa | Nguồn |
| --- | --- | --- | --- |
| `AGENTS.md` | Bản đồ vào repo: đọc gì trước, lệnh nào chuẩn, điều gì bị cấm | Toàn bộ lịch sử dự án hoặc manual quá dài | [S1] |
| `README.md` | Mục tiêu dự án, cấu trúc chính, cách chạy cơ bản | Task state ngắn hạn theo từng session | [S1] |
| `feature_list.json` hoặc tương đương | Scope công việc và trạng thái pass/fail theo feature | Rule kiến trúc chung của repo | [S2] |
| `progress.md` | Verify đã chạy, lỗi đang mở, bước kế tiếp | Chính sách bền vững lặp lại cho mọi task | [S2] |
| Test, lint, structural check | Invariant cần cưỡng chế bằng máy | Giải thích dài dòng thay cho check chạy được | [S1] |

Nếu một quyết định cần agent dùng lặp lại, nó nên sống trong repo và ở đúng
artifact của nó; nếu chỉ nằm trong chat, session mới khó khôi phục đáng tin
cậy [S1], [S2].

## Bảo trì source of truth

Không nên dừng ở việc "có tài liệu". Với tri thức vận hành quan trọng, harness
nên ưu tiên progressive disclosure và thêm check cơ học cho freshness,
cross-link, hoặc độ khớp giữa map tài liệu và cấu trúc repo thực tế [S1].

Trigger nên thêm check kiểu này khi:

- `AGENTS.md` bắt đầu trỏ tới tài liệu đã đổi tên hoặc không còn đúng;
- index trong `docs/` không còn phản ánh nơi source of truth thực sự nằm;
- agent lặp lại việc đọc nhầm tài liệu cũ hoặc bỏ qua tài liệu mới;
- review thường xuyên phát hiện policy trong prose nhưng không được cập nhật.

Nếu drift này xảy ra nhiều lần, một tác vụ doc-gardening định kỳ hoặc lint nhẹ
cho docs thường rẻ hơn việc nhắc lại trong prompt mỗi session [S1].

## Vòng lặp session

Mỗi session agent dài hạn nên làm:

1. Đọc `AGENTS.md`.
2. Đọc `progress.md`.
3. Đọc `feature_list.json` hoặc artifact trạng thái tương đương.
4. Xem git history gần đây.
5. Chạy `init.sh` hoặc setup command.
6. Chạy smoke test rẻ nhất để biết repo có đang sạch không.
7. Chọn một feature/fix chưa verify.
8. Viết acceptance criteria ngắn.
9. Triển khai thay đổi nhỏ nhất.
10. Verify bằng lệnh hoặc quan sát đã nêu.
11. Chỉ đổi trạng thái feature sau khi verify pass.
12. Ghi progress và commit nếu workflow yêu cầu.

Vòng này trực tiếp xử lý lost context, done sớm, môi trường hỏng, và thiếu kiểm
thử đầu-cuối [S2].

Nếu harness thường chạy dài hoặc qua nhiều lần reset, thiết kế nó như thể
context reset sẽ xảy ra thường xuyên: artifact khởi động phải đủ ngắn để quét
nhanh, commit phải đủ rõ để đọc lại, và setup phải đủ lặp lại để session mới
không phụ thuộc ký ức hội thoại cũ [S2], [S4].

Checkpoint thực dụng trước khi bắt đầu sửa code:

- nếu `AGENTS.md` dài đến mức không quét nhanh được, rút nó về vai trò bản đồ;
- nếu `progress.md` lặp lại policy chung, chuyển policy đó sang artifact bền
  vững hơn;
- nếu feature list không nói rõ thế nào là pass, thêm bước verify cụ thể trước
  khi triển khai.

## Acceptance contract

Dùng cho bug hoặc feature nhỏ.

```markdown
# Acceptance Contract

## Scope
- Feature/fix:
- User-visible behavior:
- Likely files:

## Acceptance Criteria
- [ ] ...
- [ ] ...

## Verification
- Unit:
- Integration:
- Browser/API:
- Log/metric/trace:

## Out of Scope
- ...
```

Contract nên ngắn hơn phần việc. Nếu dài hơn phần việc, chia nhỏ scope.

## Sprint contract

Dùng khi task trải qua nhiều file, nhiều luồng runtime, hoặc chất lượng chủ quan.

```markdown
# Sprint Contract

## Scope
- Feature:
- User path:
- API/data path:
- Likely files/modules:

## Done Means
- [ ] User can ...
- [ ] API/data reflects ...
- [ ] Error state handles ...
- [ ] No regression in ...

## Verification
- Unit:
- Integration:
- Browser/API:
- Log/metric/trace:

## Evaluator Focus
- Runtime behavior:
- Negative cases:
- UX/quality concerns:

## Out of Scope
- ...
```

Sprint contract là chuẩn chung giữa generator và evaluator. Nó giảm scope drift
và làm feedback của evaluator cụ thể hơn [S4].

## Planner, generator, evaluator

Chỉ dùng ba vai khi task đủ lớn.

| Vai | Trách nhiệm | Không làm |
| --- | --- | --- |
| Planner | Chuyển prompt thành spec, scope, sprint contract | Viết toàn bộ code |
| Generator | Triển khai phần nhỏ nhất theo contract | Mở rộng ngoài scope |
| Evaluator | Kiểm thử runtime và báo lỗi cụ thể | Chỉ đọc diff rồi khen đạt |

Evaluator tốt phải nêu bằng chứng: screenshot, DOM state, API response, database
state, log, trace, hoặc command output. Feedback nên nói tiêu chí nào fail và
bước sửa tiếp theo là gì [S4].

## Legibility map

Khi agent không thấy hành vi thật, bổ sung tín hiệu theo bảng sau.

| Khu vực | Tín hiệu | Cách verify |
| --- | --- | --- |
| UI | Browser automation, screenshot, DOM snapshot | Chạy user path chính |
| API | Request/response, contract test | Gọi endpoint và kiểm dữ liệu |
| Backend | Structured log, metric, trace | Quan sát lỗi, latency, span |
| Data | Schema, seed, query kiểm tra | Kiểm state trước/sau action |
| Build | Build log, CI log | Chạy lệnh chuẩn |
| Architecture | Import boundary, structural test | Chạy lint/test guardrail |

Legibility nghĩa là tín hiệu cần thiết nằm trong tầm đọc của agent, không phải
thêm log tùy tiện [S1].

Legibility cũng áp vào lựa chọn stack và abstraction. Nếu hai giải pháp tương
đương về yêu cầu sản phẩm, ưu tiên giải pháp có API ổn định, hành vi dễ kiểm
chứng, và phần quan trọng nằm trong repo thay vì ẩn sau upstream khó quan sát.
Khi agent thường xuyên kẹt ở một thư viện opaque, đó là tín hiệu xem lại
abstraction chứ không chỉ siết prompt [S1].

## Guardrail cơ học

Khi một rule quan trọng lặp lại, đưa nó từ prose sang check.

Ví dụ:

- cấm dependency đi ngược layer;
- yêu cầu parse dữ liệu ở boundary;
- yêu cầu structured logging ở luồng quan trọng;
- giới hạn file size nếu drift kích thước gây hại;
- chặn update feature status nếu verify chưa pass;
- chạy smoke test trước merge.

Guardrail chỉ nên bảo vệ invariant thật. Rule quá rộng tạo nhiễu và làm agent
tối ưu quanh check thay vì quanh mục tiêu [S1], [S3].

## Cleanup

Khi throughput tăng, cleanup phải có trigger và verify.

Trigger hợp lý:

- cùng một helper xuất hiện nhiều lần;
- feature bypass architecture boundary;
- progress log lặp lại cùng lỗi;
- evaluator liên tục bắt cùng nhóm defect;
- code mới tạo workaround thay vì sửa nguyên nhân.

Cleanup task nên có scope, acceptance criteria, verification, và rollback path.
Đây là garbage collection cho codebase agent-first [S1].

## Ablation harness

Sau khi model hoặc tooling thay đổi, xem lại harness:

| Lớp | Câu hỏi ablation |
| --- | --- |
| Feature list | Nếu bỏ, agent có đánh dấu xong sớm không? |
| Progress log | Nếu bỏ, session mới có mất context không? |
| `init.sh` | Nếu bỏ, agent có mất thời gian đoán setup không? |
| Browser/API check | Nếu bỏ, runtime defect có tăng không? |
| Evaluator | Nếu gộp vào generator, chất lượng có giảm không? |
| Planner | Nếu bỏ planner, scope có drift không? |
| Guardrail | Nếu tắt rule, vi phạm có xuất hiện lại không? |

Giữ phần rẻ và hiệu quả. Loại bỏ orchestration đắt nếu không còn tạo outcome
tốt hơn [S4].

## Definition of done

Một thay đổi harness hoàn thành khi:

- scope và acceptance criteria rõ;
- lệnh hoặc quan sát verify đã chạy;
- state/progress chỉ cập nhật sau verify;
- guardrail mới gắn với failure mode thật;
- tài liệu chỉ cite `[S1]-[S4]`;
- không còn placeholder hoặc nguồn ngoài phạm vi.
