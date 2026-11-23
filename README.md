# Kids English

Открытый интерактивный тренажёр английского для детей. Один публичный репозиторий. Учебные материалы, сайт, методология и техническая документация версионируются в GitHub.

## Сайт
- GitHub Pages: https://nikonovmike2737.github.io/kids-english/
- Стартовая версия: 3 темы, 12 заданий; выбор ответа, сопоставление слов с картинками/эмодзи, составление фраз.
- Вся логика правильных и неправильных ответов, индивидуальный разбор заданий и повторное прохождение реализованы на клиенте.
- Сайт не собирает и не передаёт ответы/результаты и не содержит форм обратной связи. Результат существует только на открытой вкладке.
- При отсутствии публикации: Settings → Pages → Source: GitHub Actions, затем перезапустить workflow Deploy Kids English Pages.

## Роли и ветки
- `main` — опубликованный, принятый релиз.
- `canon/source-of-truth` — канонические роли, требования и правила, предложения изменений через PR.
- `role/methodologist` — программа, учебный контент, приёмка, обработка обезличенных отзывов родителей через чат.
- `role/technical` — интерфейс, технические тесты, GitHub Pages и эксплуатация.

Основные документы: [канон проекта](docs/source-of-truth/PROJECT_CHARTER.md), [методолог](docs/source-of-truth/ROLE_METHODOLOGIST.md), [технический партнёр](docs/source-of-truth/ROLE_TECHNICAL.md), [приватность](docs/source-of-truth/CONTENT_AND_PRIVACY_CANON.md), [реестр источников](docs/source-of-truth/SOURCE_INVENTORY.md).
Инструкции агентам: [AGENTS.md](AGENTS.md).

## Материалы
- [Программа](docs/methodology/CURRICULUM.md)
- [Словарь](docs/methodology/VOCABULARY.md)
- [Сценарии занятий](docs/methodology/LESSON_PLANS.md)
- [Рубрика заданий](docs/methodology/QUESTION_DESIGN.md)
- [Обезличенные методические сигналы](docs/methodology/PRODUCT_FEEDBACK.md)
- [Приёмка](docs/methodology/RELEASE_ACCEPTANCE.md)
- [Уроки ENG-001–003](content/lessons/)

**Происхождение**: восстановлено по доступному контексту проекта ChatGPT и стартовому HTML. Не путать с дословным экспортом оригинальных чатов. До документальной сверки: RECONSTRUCTED.
