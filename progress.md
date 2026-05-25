# Progress

## 2026-05-25

### Context

- Task: Tạo harness tối thiểu cho repository nghiên cứu harness engineering.
- Branch: `main`.
- Relevant files: `AGENTS.md`, `feature_list.json`, `init.sh`,
  `scripts/verify-harness.mjs`, `tests/verify-harness.test.mjs`.

### Done

- Chốt thiết kế single-agent harness với state, smoke test và guardrail tài liệu.
- Xác định source policy hiện tại của repository là `[S1]-[S5]`.
- Tạo state bền vững, script bootstrap và guardrail citation/cross-link.
- Thêm test cho baseline hợp lệ, citation ngoài phạm vi, artifact thiếu và
  README map bị thiếu liên kết.

### Verification

- Baseline command: `npm test`.
- Baseline result: pass với 6 test trước khi thêm harness.
- Command: `node --test tests/verify-harness.test.mjs`.
- Result: pass với 4 test.
- Command: `./init.sh`.
- Result: pass với 10 test.
- Command: `npm run verify`.
- Result: pass; verifier báo `Harness verification passed.` và 10 test pass.
- Command: quét placeholder và citation ngoài `[S1]-[S5]` trong artifact
  production.
- Result: không có kết quả khớp.

### Open Issues

- Không có lỗi mở từ vòng kiểm chứng hiện tại.

### Next

- Session tiếp theo đọc file này và `feature_list.json` trước khi mở rộng
  harness cho failure mode mới.

## 2026-05-25 - Cài skill theo project

### Context

- Task: Đổi lệnh cài package để chỉ cài skill trong project hiện tại, không
  ghi vào `$HOME/.agents/skills`.
- Relevant files: `scripts/install-skills.mjs`, `tests/install-skills.test.mjs`,
  `README.md`, `feature_list.json`.

### Done

- Đổi đích cài skill thành `./.agents/skills` dựa trên `projectRoot`.
- Thêm regression assertion cho API và CLI: skill nằm trong project và không
  xuất hiện dưới home directory test.
- Cập nhật README cho đường dẫn cài đặt project-local.
- Ghi capability đã verify thành `H003` trong `feature_list.json`.

### Verification

- Command: `node --test tests/install-skills.test.mjs` trước khi sửa
  implementation.
- Result: fail đúng nguyên nhân; skill không tồn tại tại
  `projectRoot/.agents/skills`.
- Command: `node --test tests/install-skills.test.mjs` sau khi sửa.
- Result: pass với 6 test.
- Command: `npm run verify`.
- Result: pass; verifier báo `Harness verification passed.` và 10 test pass.
- Command: `npm run pack:dry`.
- Result: pass; tạo dry-run package `codex-harness-engineering-0.1.3.tgz`.

### Next

- Không có bước tiếp theo mở cho thay đổi installer hiện tại.

## 2026-05-25 - Audit quy trinh cap nhat state

### Context

- Task: Kiểm tra và sửa harness sau khi thay đổi installer được hoàn tất mà
  ban đầu thiếu cập nhật state.
- Relevant files: `AGENTS.md`, `scripts/install-skills.mjs`,
  `scripts/verify-harness.mjs`, `tests/install-skills.test.mjs`,
  `tests/verify-harness.test.mjs`, `feature_list.json`, `progress.md`.

### Finding

- `scripts/verify-harness.mjs` trước audit chỉ xác nhận state file tồn tại; nó
  không ràng buộc một thay đổi hành vi đang mở phải cập nhật state.
- Kiểm tra chỉ dựa vào state file đã modified cũng chưa đủ, vì thay đổi mới có
  thể đi nhờ entry progress của task trước.

### Done

- Làm rõ trong `AGENTS.md` rằng task nhỏ vẫn phải cập nhật state nếu thay đổi
  hành vi, guardrail, package, script, test, skill hoặc quy tắc agent.
- Thêm gate vào `scripts/verify-harness.mjs` để diff hành vi yêu cầu cả
  `feature_list.json` và `progress.md` thay đổi.
- Yêu cầu entry mới nhất trong `progress.md` nêu trực tiếp tất cả artifact hành
  vi đang đổi; điều này chặn việc dùng entry lịch sử để pass verify.
- Thêm regression test trong `tests/verify-harness.test.mjs` cho cả hai lỗi.
- Đánh dấu capability mới `H004` là verified trong `feature_list.json`.

### Verification

- Command: `node --test tests/verify-harness.test.mjs` trước từng thay đổi
  verifier.
- Result: fail đúng nguyên nhân; verifier lần lượt chấp nhận diff thiếu state
  và chấp nhận tham chiếu chỉ nằm trong entry progress cũ.
- Command: `node --test tests/verify-harness.test.mjs` sau khi sửa.
- Result: pass với 7 test.
- Command: `node scripts/verify-harness.mjs` trước khi ghi entry audit này.
- Result: fail đúng mục đích, báo thiếu tham chiếu current-entry cho
  `AGENTS.md`, `scripts/verify-harness.mjs` và `tests/verify-harness.test.mjs`.
- Command: `npm run verify`.
- Result: pass; verifier báo `Harness verification passed.` và 13 test pass.
- Command: `./init.sh`.
- Result: pass với 13 test.
- Command: `npm run pack:dry`.
- Result: pass; tạo dry-run package `codex-harness-engineering-0.1.3.tgz`.

### Next

- Gate hiện kiểm tra diff chưa commit so với `HEAD`; nếu workflow sau này cho
  phép commit trước verify, cần mở rộng baseline kiểm tra sang branch/base.

## 2026-05-25 - Quy chuan harness cho project dich

### Context

- Task: Bổ sung quy chuẩn có thể dùng khi tạo harness cho repository khác.
- Relevant files: `docs/harness-engineering/implementation-playbook.md`,
  `feature_list.json`, `progress.md`; working tree đang tiếp tục chứa các
  behavior artifact đã verify: `AGENTS.md`, `scripts/install-skills.mjs`,
  `scripts/verify-harness.mjs`, `tests/install-skills.test.mjs`,
  `tests/verify-harness.test.mjs`.

### Done

- Thêm phần quy chuẩn project mới vào playbook, gồm artifact bắt buộc, contract
  cập nhật state, gate cơ học tối thiểu và checklist bootstrap.
- Nêu rõ baseline của diff gate phải theo workflow verify-before-commit hoặc
  CI-after-commit của project đích.
- Đánh dấu capability tài liệu `H005` là verified trong `feature_list.json`
  sau khi package verification pass.

### Verification

- Command: `npm run verify`.
- Result: pass; verifier báo `Harness verification passed.` và 13 test pass.
- Command: `npm run pack:dry`.
- Result: pass; tạo dry-run package `codex-harness-engineering-0.1.3.tgz`.
- Command: `git diff --check`.
- Result: pass; không có lỗi whitespace.

### Next

- Dùng phần quy chuẩn này khi cài package vào project đích và điều chỉnh tập
  behavior artifact theo workflow cụ thể của project đó.
