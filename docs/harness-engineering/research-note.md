# Harness Engineering cho AI Agent làm việc dài hạn

## Tóm tắt

Harness engineering là kỷ luật thiết kế môi trường quanh AI agent để agent có
thể tạo tiến triển dài hạn, kiểm chứng được, và duy trì được. Bốn bài của OpenAI
và Anthropic cho thấy cùng một luận điểm: năng lực mô hình chỉ trở thành năng
lực sản xuất khi môi trường cung cấp state bền vững, tool dễ dùng, quan sát
runtime, tiêu chí nghiệm thu, feedback loop, guardrail cơ học, và cleanup [S1],
[S2], [S3], [S4].

Tài liệu này chỉ tổng hợp bốn nguồn đó. Mọi nguồn mở rộng đã bị loại khỏi bản
hiện tại để giữ trọng tâm.

## 1. Vấn đề

Một agent có thể viết code tốt trong một lượt nhưng vẫn thất bại ở công việc dài
hạn. Các failure mode lặp lại là:

- session mới không biết session trước đã làm gì;
- agent cố hoàn thành toàn bộ app trong một lần và để lại trạng thái khó tiếp
  tục;
- agent nhìn thấy vài feature đã xong rồi tuyên bố cả dự án hoàn thành;
- agent sửa code nhưng không kiểm thử đầu-cuối;
- agent không thấy UI, log, metric, trace, hoặc trạng thái runtime;
- throughput cao làm pattern xấu lan rộng nhanh hơn tốc độ con người review.

Anthropic mô tả vấn đề multi-session như một bài toán khôi phục trạng thái:
context window không đủ để bảo toàn toàn bộ tiến triển, nên harness phải đặt
state vào artifact bền vững như feature list, progress file, `init.sh`, và git
history [S2]. OpenAI mô tả cùng vấn đề ở quy mô repository: khi agent tạo code
nhanh hơn con người có thể QA thủ công, công việc kỹ sư chuyển sang thiết kế
môi trường, feedback loop, và control system quanh agent [S1].

Một ràng buộc quan trọng đến từ Anthropic: không phải mọi task đều cần agent hay
harness phức tạp. Nên bắt đầu bằng giải pháp đơn giản nhất, dùng workflow khi
đường đi đã rõ, và chỉ dùng agent tự chủ hoặc orchestration nhiều bước khi
tradeoff về cost, latency, và lỗi tích lũy được biện minh bằng outcome [S3].

## 2. Định nghĩa

Trong phạm vi bốn nguồn này, **harness** là lớp scaffold ngoài mô hình giúp
agent làm việc đáng tin hơn. Nó có thể bao gồm:

- prompt và acceptance criteria;
- file state như feature list và progress log;
- script setup như `init.sh`;
- git history và commit discipline;
- tool để chạy app, browser automation, API check, log, metric, trace;
- planner, generator, evaluator khi task cần tách vai trò;
- linter, structural test, CI rule, và cleanup cadence.

Harness engineering là việc thiết kế, đo, và điều chỉnh lớp scaffold đó. Nó
khác với prompt engineering ở chỗ trọng tâm không chỉ là câu lệnh cho một lượt
model, mà là toàn bộ môi trường giúp nhiều lượt agent tiếp tục, quan sát, sửa,
và để lại bằng chứng.

## 3. Vai trò mới của kỹ sư

OpenAI tóm tắt mô hình vận hành bằng ý tưởng: con người định hướng, agent thực
thi. Trong case study của họ, Codex viết application logic, test, CI,
documentation, observability, và internal tooling; con người ưu tiên công việc,
dịch phản hồi thành acceptance criteria, xác minh outcome, và biến failure thành
cải tiến môi trường [S1].

Điểm quan trọng không phải là thay con người bằng agent, mà là chuyển tầng làm
việc của con người. Khi agent thất bại, câu hỏi tốt không phải "nhắc mạnh hơn
được không?", mà là "agent thiếu capability, context, tool, guardrail, hoặc
feedback loop nào?" [S1].

## 4. Nguyên lý vận hành

### 4.1 Bắt đầu đơn giản

Anthropic phân biệt workflow và agent. Workflow dùng đường đi định sẵn; agent
tự điều khiển process và tool usage. Vì agentic system đổi latency và cost lấy
performance, harness nên bắt đầu từ cấu trúc nhỏ nhất: một LLM call có retrieval,
tool, memory, hoặc một workflow đơn giản nếu task phân rã rõ [S3].

Chỉ thêm planner, evaluator, nhiều agent, hoặc vòng lặp dài khi failure mode cụ
thể xuất hiện: mất context, tự đánh giá yếu, runtime vô hình, scope drift, hoặc
QA không đủ [S2], [S4].

### 4.2 Ngoại hóa trạng thái

Harness cho agent dài hạn cần đưa bộ nhớ ra khỏi hội thoại. Anthropic dùng
initializer agent để tạo `init.sh`, progress file, feature list, và commit ban
đầu. Coding agent sau đó đọc các artifact này, chọn một feature chưa pass, làm
từng bước, cập nhật progress, và commit trạng thái sạch [S2].

Feature list có vai trò như contract bền vững. Mỗi feature nên có mô tả, bước
kiểm tra, và trạng thái pass/fail. Agent chỉ được đổi trạng thái sau khi xác
minh. Cách này giảm hai lỗi phổ biến: làm quá rộng và đánh dấu xong quá sớm
[S2].

Việc Anthropic dùng `feature_list.json` thay vì prose thuần cũng cho thấy một
điểm thiết kế quan trọng: trạng thái công việc nên đủ có cấu trúc để session
mới đọc, lọc, và cập nhật pass/fail nhất quán mà không phải suy diễn lại từ
văn bản tự do [S2].

Git history trong mẫu harness này cũng không chỉ là nhật ký. Anthropic nêu rõ
việc để agent kết thúc session bằng commit message mô tả rõ và progress update
giúp nó có recovery point để revert thay đổi xấu và quay về working state sạch
hơn trong vòng sau [S2].

OpenAI áp dụng cùng logic ở mức repository knowledge: `AGENTS.md` nên là bản đồ
ngắn trỏ tới tài liệu sâu hơn, còn source of truth nằm trong `docs/`, plan,
schema, test, lint, và artifact version hóa. Nếu quyết định chỉ nằm trong chat,
Google Docs riêng, hoặc trí nhớ con người, agent khó dùng nó trong lúc chạy
[S1].

Một diễn giải thực dụng từ [S1] và [S2] là nên tách hai loại trạng thái. Loại
ổn định của repository gồm rule, architecture, setup, và lệnh chuẩn; loại biến
động của công việc gồm feature đang làm, kết quả verify gần nhất, và bước kế
tiếp. Trộn cả hai vào một file dài làm session mới khó phục hồi nhanh và làm
instruction dễ drift theo tiến độ ngắn hạn [S1], [S2].

OpenAI còn đi xa hơn ở chỗ không chỉ lưu tri thức trong repo, mà còn tổ chức nó
theo progressive disclosure và kiểm tra freshness/cross-link bằng cơ chế cơ
học. Hệ quả là source of truth không nên chỉ "được viết xuống", mà còn nên có
cách để phát hiện doc cũ, liên kết hỏng, hoặc map điều hướng không còn phản ánh
thực tế của codebase [S1].

Anthropic còn cho thấy một điểm mạnh hơn: context reset không nhất thiết là
mất mát phải chịu đựng, mà có thể trở thành cơ chế chủ đích của harness. Khi
state handoff đủ tốt qua feature list, progress file, git log, và setup script,
session mới có thể khởi động lại với ngữ cảnh gọn hơn và ít bị context anxiety
hơn là cố kéo dài một chuỗi hội thoại suy giảm dần [S2], [S4].

### 4.3 Làm môi trường dễ đọc với agent

Agent chỉ sửa đáng tin những gì nó quan sát được. Anthropic cho thấy browser
automation giúp Claude kiểm thử feature web như người dùng thật và phát hiện lỗi
không thấy được từ code hoặc unit test đơn lẻ [S2]. OpenAI mở rộng ý tưởng này:
app, UI, log, metric, trace, và môi trường dev theo worktree phải trở thành tín
hiệu agent đọc được [S1].

Trong harness tốt, tool là giác quan của agent. Một web agent không có browser
automation không thật sự thấy app. Một backend agent không có log, metric, hoặc
trace khó suy luận về hành vi runtime. Một agent không biết setup app sẽ mất
thời gian đoán cách chạy trước khi làm việc thật [S1], [S2].

Anthropic cũng nhấn mạnh agent-computer interface. Tool nên có tên, tham số,
description, ví dụ, edge case, và ranh giới rõ. Tool khó dùng với con người mới
vào dự án thường cũng khó dùng với model [S3].

OpenAI bổ sung một hệ quả thiết kế ít hiển nhiên hơn: ngay cả lựa chọn
dependency và abstraction cũng là một phần của legibility. Công nghệ có API ổn
định, hành vi dễ mô hình hóa, và phần logic nằm trong repo thường dễ cho agent
reason hơn lớp upstream opaque. Vì vậy harness không chỉ thêm tool; nó còn có
thể ưu tiên stack và helper mà agent inspect, validate, và sửa trực tiếp được
[S1].

### 4.4 Tách sinh kết quả khỏi đánh giá

Một agent tự đánh giá output của chính nó thường quá tích cực, đặc biệt ở task
chủ quan như frontend design. Anthropic giải quyết bằng cách tách generator và
evaluator. Generator tạo sản phẩm; evaluator dùng tiêu chí chấm, Playwright, và
quan sát runtime để đưa phản hồi cụ thể; generator lặp lại dựa trên phản hồi đó
[S4].

Điểm cốt lõi là evaluator không cần hoàn hảo. Nó cần đủ hoài nghi và đủ cụ thể:
tiêu chí nào fail, bằng chứng quan sát là gì, user path nào lỗi, API hoặc state
nào chưa đúng, và sửa tiếp nên nhắm vào đâu [S4].

### 4.5 Dùng sprint contract cho task dài

Với phát triển ứng dụng dài hạn, Anthropic dùng planner để mở rộng prompt ngắn
thành spec, generator để build, evaluator để QA, và sprint contract để hai bên
đồng thuận trước về scope và "done" [S4].

Sprint contract không phải thủ tục quản lý dự án. Nó là artifact điều khiển:
giới hạn phạm vi generator, làm rõ acceptance criteria, và cho evaluator tiêu
chuẩn chấm độc lập. Nếu task nhỏ, một acceptance contract hoặc test case là đủ.
Nếu task dài, contract nên nêu user path, API/data path, negative case, và cách
quan sát runtime [S3], [S4].

### 4.6 Cưỡng chế invariant bằng cơ chế kỹ thuật

OpenAI nhấn mạnh rằng documentation đơn thuần không giữ được coherence khi code
do agent sinh ra tăng nhanh. Họ mã hóa architecture rule, dependency direction,
data boundary parsing, structured logging, file size limit, naming convention,
và reliability rule bằng custom linter hoặc structural test [S1].

Nguyên tắc là: prompt nói điều nên làm; guardrail cơ học chặn điều không được
làm. Khi review comment hoặc bug lặp lại, harness tốt biến judgment đó thành
doc, lint, test, hoặc tool để agent tương lai không phải học lại từ đầu [S1].

### 4.7 Cleanup là một phần của harness

Throughput cao đổi failure mode từ "agent không viết được" sang "agent viết
nhiều và lan truyền pattern lệch". OpenAI mô tả recurring cleanup process,
quality grade, và targeted refactoring pull request như một dạng garbage
collection cho codebase agent-first [S1].

Cleanup không phải refactor tùy hứng. Nó nên là task có trigger, phạm vi, tiêu
chí nghiệm thu, và verification giống mọi thay đổi khác.

## 5. Lợi ích

### 5.1 Tiến triển dài hạn tốt hơn

Externalized state giúp session mới không phải đoán dự án đang ở đâu. Feature
list, progress file, git history, và `init.sh` giảm thời gian khởi động và giúp
agent chọn phần việc kế tiếp có phạm vi rõ [S2].

### 5.2 QA tốt hơn

Browser automation, test runtime, API check, log, metric, và trace giúp agent
kiểm chứng hành vi thay vì chỉ đọc code. Evaluator riêng có thể bắt gap mà
generator bỏ sót, như feature display-only, interaction thiếu chiều sâu, hoặc
stub chưa được thay bằng hành vi thật [S1], [S2], [S4].

### 5.3 Judgment của con người tích lũy

Khi preference, review comment, architecture rule, và bug pattern được mã hóa
vào docs, lint, test, hoặc cleanup, chúng ảnh hưởng tới nhiều lần chạy agent sau
đó. Harness biến một lần can thiệp của con người thành ràng buộc lặp lại [S1].

### 5.4 Tốc độ cao hơn nếu môi trường đủ chín

OpenAI báo cáo case study nội bộ với throughput PR cao và codebase lớn do Codex
sinh ra, nhưng họ cũng cảnh báo mức tự chủ đó phụ thuộc mạnh vào cấu trúc và
tooling cụ thể của repository [S1]. Vì vậy lợi ích không nên được đọc như lời
hứa phổ quát; nó là kết quả của đầu tư vào harness.

## 6. Chi phí và giới hạn

### 6.1 Complexity có giá

Harness nhiều agent, nhiều vòng evaluator, và nhiều QA runtime có thể tốn nhiều
giờ và token. Anthropic nêu các run ứng dụng dài hạn kéo dài hàng giờ với chi
phí đáng kể. Vì vậy harness phức tạp phải được dùng như tradeoff có chủ đích,
không phải mặc định [S4].

### 6.2 Model capability thay đổi thiết kế harness

Một lớp orchestration hữu ích với model hiện tại có thể không còn cần thiết khi
model mới tốt hơn. Anthropic khuyến nghị re-examine harness khi model thay đổi:
loại bỏ phần không còn load-bearing và thêm phần mới nếu model mở ra khả năng
khác [S4].

### 6.3 Evaluator vẫn có giới hạn

Evaluator là LLM nên vẫn có thể bỏ sót bug hoặc đánh giá sai, nhất là ở domain
mà nó thiếu giác quan trực tiếp. Anthropic nêu ví dụ âm thanh: QA về musical
taste bị giới hạn nếu model không thực sự nghe được output [S4].

### 6.4 Kết quả không tự động tổng quát hóa

OpenAI nói rõ khả năng Codex drive feature end-to-end phụ thuộc mạnh vào cấu
trúc và tooling của repository. Đội khác không nên kỳ vọng outcome tương tự nếu
chưa có source of truth cục bộ, setup lặp lại, tool quan sát, test, lint, review
loop, và cleanup [S1].

## 7. Mô hình tổng hợp

Một harness trưởng thành có thể được đọc như hệ điều khiển gồm bốn lớp:

| Lớp | Câu hỏi | Artifact điển hình | Nguồn |
| --- | --- | --- | --- |
| State | Agent biết việc đã xảy ra chưa? | feature list, progress log, git history | [S2] |
| Senses | Agent thấy hành vi thật chưa? | browser, API check, log, metric, trace | [S1], [S2], [S4] |
| Standards | Done nghĩa là gì? | acceptance criteria, sprint contract, evaluator rubric | [S3], [S4] |
| Constraints | Điều gì không được drift? | lint, structural test, CI, cleanup | [S1] |

Thứ tự triển khai nên đi từ rẻ đến đắt: state trước, verification trước, tool
quan sát khi cần, evaluator khi self-review yếu, planner khi scope mơ hồ, và
guardrail khi invariant đã rõ.

## 8. Câu hỏi mở

Bốn nguồn để lại một số câu hỏi nghiên cứu:

- Khi nào một agent tổng quát tốt hơn nhiều agent chuyên biệt? [S2], [S4]
- Khi nào evaluator đáng chi phí so với self-review hoặc test deterministic?
  [S3], [S4]
- Làm sao đo được phần cải thiện đến từ model, prompt, tool, state, evaluator,
  hay guardrail? [S3], [S4]
- Architecture coherence của codebase agent-generated sẽ tiến hóa thế nào qua
  nhiều năm? [S1]
- Những phần harness nào nên bị loại bỏ khi model mới mạnh hơn? [S4]

## 9. Kết luận

Harness engineering làm autonomy trở thành thuộc tính của hệ thống, không chỉ
là thuộc tính của model. Một model mạnh trong môi trường thiếu state, thiếu
tool, thiếu tiêu chí done, và thiếu guardrail sẽ tạo tiến triển giòn. Cùng model
đó trong harness tốt có thể tiếp tục công việc, quan sát lỗi, nhận feedback,
sửa có bằng chứng, và giữ kiến trúc ổn định hơn.

Kết luận thực dụng từ bốn bài là: đừng bắt đầu bằng harness phức tạp. Bắt đầu
bằng task rõ, state bền vững, setup lặp lại, và verify thật. Chỉ thêm evaluator,
planner, observability, hoặc cleanup automation khi failure mode cụ thể cho
thấy chúng đang mua thêm chất lượng đáng giá.
