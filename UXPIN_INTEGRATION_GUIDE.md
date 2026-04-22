# Инструкция по интеграции Hexa UI в UXPin Merge

Эта инструкция описывает, как подключить библиотеку `@kaspersky/hexa-ui` к UXPin Merge, проверить ее локально, опубликовать компоненты в UXPin и начать собирать прототипы.

Зона ответственности интеграции: `packages/kaspersky-hexa-ui`.

## 1. Что уже подготовлено

Интеграция сделана в формате wrapped integration: UXPin работает не напрямую с production-компонентами, а с обертками, адаптированными для прототипирования.

Основные файлы:

- `packages/kaspersky-hexa-ui/uxpin.config.js` - конфиг библиотеки UXPin Merge.
- `packages/kaspersky-hexa-ui/uxpin.webpack.config.js` - отдельный webpack-конфиг для Merge CLI.
- `packages/kaspersky-hexa-ui/uxpin/UXPinWrapper.tsx` - общий wrapper с темой, глобальными стилями, AntD CSS, шрифтами и токенами.
- `packages/kaspersky-hexa-ui/uxpin/components/*` - UXPin-обертки над компонентами Hexa UI.
- `packages/kaspersky-hexa-ui/uxpin/components/*/uxpin-presets/*.jsx` - стартовые JSX presets для drag-and-drop в UXPin.
- `packages/kaspersky-hexa-ui/uxpin/preview.tsx` - preview-данные и общие helpers для UXPin-компонентов.
- `packages/kaspersky-hexa-ui/uxpin/scripts/generate-components.mjs` - генератор простых UXPin wrappers и missing JSX presets из public exports пакета.

В `package.json` пакета есть команды:

```bash
npm run uxpin:dev
npm run uxpin:push
npm run uxpin:sync-components
```

## 2. Preflight перед запуском

Работаем из корня репозитория:

```bash
cd /Users/dmitry/uif
```

Сначала проверьте, что в рабочем дереве нет незарезолвленных merge conflict markers:

```bash
rg -n '<<<<<<<|=======|>>>>>>>' packages/kaspersky-hexa-ui
```

Если markers есть, их нужно убрать до запуска UXPin Merge. При резолве конфликтов для UXPin-слоя обычно нужно сохранять расширенные wrappers из `uxpin/components/*`, а не упрощенные версии вида `props => <HexaComponent {...props} />`, иначе потеряется UXPin-friendly поведение для `PageWrapper`, `Table`, `Toolbar`, `Menu`, `PageHeader` и других составных компонентов.

Проверьте состояние рабочей копии:

```bash
git status --short
```

Зависимости в монорепозитории устанавливаются через Yarn/Lerna:

```bash
yarn install:all
```

Если зависимости уже установлены и работа идет только внутри пакета `kaspersky-hexa-ui`, можно перейти сразу в пакет:

```bash
cd packages/kaspersky-hexa-ui
```

Быстрая TypeScript-проверка:

```bash
npm run lint-ts
```

Не добавляйте и не обновляйте `package-lock.json` без явной причины. Репозиторий в целом ориентирован на Yarn, а package-level скрипты запускаются через `npm run`.

## 3. Локальный запуск UXPin Merge

Перейдите в пакет:

```bash
cd /Users/dmitry/uif/packages/kaspersky-hexa-ui
```

Запустите локальный Merge-сервер:

```bash
npm run uxpin:dev
```

Команда запускает:

```bash
uxpin-merge --disable-tunneling
```

Флаг `--disable-tunneling` нужен, чтобы UXPin работал через локальный сервер без ngrok. В этом режиме лучше использовать Chrome.

Если стандартный порт занят, можно передать другой порт:

```bash
npm run uxpin:dev -- --port 8878
```

После запуска CLI напечатает URL. Откройте его в браузере и проверьте:

- библиотека называется `Kaspersky Hexa UI`;
- категория компонентов называется `Hexa UI (stable)`;
- компоненты отображаются в списке;
- компоненты рендерятся на canvas;
- props меняются через UXPin properties panel;
- составные компоненты корректно принимают children.

## 4. Публикация компонентов в UXPin

В UXPin нужно создать или открыть Merge library для React components и получить auth token.

Токен нельзя коммитить в репозиторий. Локально задайте его через environment variable:

```bash
export UXPIN_AUTH_TOKEN="YOUR_TOKEN"
```

Затем выполните push:

```bash
cd /Users/dmitry/uif/packages/kaspersky-hexa-ui
npm run uxpin:push
```

Команда использует `uxpin.config.js`, который уже указывает:

- список компонентов;
- общий wrapper;
- webpack config.

Для CI используйте тот же подход:

```bash
yarn install:all
cd packages/kaspersky-hexa-ui
npm run uxpin:push
```

В CI `UXPIN_AUTH_TOKEN` должен быть secret-переменной.

## 5. Как начинать работу в UXPin

Базовая композиция страницы:

```text
PageWrapper
  PageHeader
  Toolbar
  SectionWrapper или GroupWrapper
    Table / формы / карточки / другой контент
```

`PageWrapper` стоит использовать как корневой контейнер страницы. Он задает page-level layout, padding, vertical gap и scrolling.

`PageHeader` используется для заголовка страницы. В UXPin wrapper есть удобные visibility props:

- `title`;
- `description`;
- `descriptionText`;
- `iconBefore`;
- `iconBeforeSlot`;
- `breadcrumbs`;
- `tagsAfter`;
- `elementAfter`;
- `elementAfterSlot`.

`Toolbar` используется как панель действий. Для сборки через children применяются:

- `ToolbarLeftItems`;
- `ToolbarRightItems`;
- `ToolbarButton`;
- `ToolbarSearch`;
- `Dropdown`;
- `DropdownItem`.

`Table` собирается через config-only children:

- `TableColumn` - описание колонок;
- `TablePlaceholder` - empty state.

Пример структуры таблицы:

```text
Table
  TableColumn
  TableColumn
  TableColumn
  TablePlaceholder
```

Для таблиц есть два основных режима высоты:

- `heightMode="hug"` - таблица подстраивается под контент.
- `heightMode="fill"` - таблица занимает доступную высоту wrapper/frame, а пагинация остается внизу.

`Menu` собирается через вложенные `MenuItem`. Это предпочтительный путь для UXPin, потому что автор макета может управлять структурой меню прямо в layers.

`Breadcrumbs` собирается через `BreadcrumbItem`.

`Dropdown` собирается через `DropdownItem`. Такой dropdown можно использовать как overlay для toolbar/button-сценариев.

## 6. Как добавить компонент в UXPin

Если компонент простой и его public API уже экспортируется из `src/index.ts`, можно сгенерировать базовую обертку и стартовый preset:

```bash
cd /Users/dmitry/uif/packages/kaspersky-hexa-ui
npm run uxpin:sync-components
```

Генератор создает файлы в:

```text
uxpin/components/<Component>/<Component>.tsx
uxpin/components/<Component>/uxpin-presets/<Component>.jsx
```

Полезные режимы:

```bash
# посмотреть, что будет создано, не меняя файлы
npm run uxpin:sync-components -- --dry-run

# синхронизировать только один или несколько компонентов
npm run uxpin:sync-components -- --component Tag
npm run uxpin:sync-components -- --component Tag,ToggleButtonGroup

# дособрать только missing presets
npm run uxpin:sync-components -- --presets-only

# пересоздать presets или wrappers принудительно
npm run uxpin:sync-components -- --component Text --force-presets
npm run uxpin:sync-components -- --component Text --force-wrappers
```

Если компонент уже имеет ручную UXPin-обертку, не перезатирайте ее без необходимости. Для сложных компонентов ручная обертка предпочтительнее, потому что она может:

- упрощать props для дизайнеров;
- добавлять visibility toggles;
- поддерживать UXPin children;
- давать безопасные default values;
- преобразовывать UXPin-friendly props в production API.

При проектировании props используйте порядок источников:

1. Public TypeScript API компонента.
2. Storybook/meta/runtime behavior.
3. `packages/kaspersky-hexa-ui/helpers/propsDictionary.ts` как glossary и mapping layer.

`propsDictionary.ts` не является источником истины поверх TypeScript API.

## 7. JSX presets

Presets задают стартовое состояние компонента при drag-and-drop в UXPin. Для простых компонентов их теперь можно получать автоматически через `npm run uxpin:sync-components`, а потом при необходимости вручную улучшать для более богатого стартового состояния.

Путь:

```text
packages/kaspersky-hexa-ui/uxpin/components/<Component>/uxpin-presets/<Component>.jsx
```

В preset нужно импортировать React и нужные компоненты, затем экспортировать JSX:

```jsx
import React from 'react'

import Button from '../Button'

export default (
  <Button
    uxpId="button-primary"
    text="Button"
    mode="primary"
  />
)
```

Правила:

- у каждого компонента в preset должен быть уникальный `uxpId`;
- props должны быть JSON-serializable;
- не передавайте функции через props в preset;
- для nested presets используйте стабильные `uxpId`, чтобы UXPin мог корректно сохранять overrides.

## 8. Проверки перед публикацией

Минимальная проверка для UXPin-изменений:

```bash
cd /Users/dmitry/uif/packages/kaspersky-hexa-ui
rg -n '<<<<<<<|=======|>>>>>>>' .
npm run lint-ts
npm run uxpin:dev
```

Если менялись production-компоненты или shared preview-логика:

```bash
npm run test:only
```

Если менялись визуальные состояния, Storybook previews или компоненты с высоким визуальным риском:

```bash
npm run test:screenshots
```

Не запускайте monorepo-wide checks без необходимости. Для UXPin-работы сначала выбирайте минимальную полезную проверку внутри `packages/kaspersky-hexa-ui`.

## 9. Что не стоит коммитить без явной причины

Обычно не нужно включать в обычный feature commit:

- `.uxpin-merge/**`;
- сгенерированные UXPin sync artifacts;
- случайный `package-lock.json`;
- lockfile churn без изменения зависимостей;
- generated icon files или build output, если задача не про них.

Если задача именно про публикацию или синхронизацию UXPin library, generated artifacts можно рассматривать отдельно и явно описывать в PR.

## 10. Частые проблемы

### Merge CLI падает сразу

Проверьте:

```bash
rg -n '<<<<<<<|=======|>>>>>>>' packages/kaspersky-hexa-ui
npm run lint-ts
```

Частые причины:

- незарезолвленные conflict markers;
- невалидный `package.json`;
- TypeScript-ошибка в wrapper;
- компонент импортирует путь, которого нет в webpack aliases.

### Компонент не появился в UXPin

Проверьте:

- компонент лежит в отдельной папке;
- имя папки, файла и default export совпадают;
- путь компонента попал в `uxpin.config.js`;
- файл имеет `export default`;
- после добавления компонента перезапущен `npm run uxpin:dev`.

### Стили выглядят неправильно

Проверьте:

- `UXPinWrapper.tsx` подключает `GlobalStyle`, theme provider, AntD CSS, core fonts/colors/typography и `style/styles.less`;
- `uxpin.webpack.config.js` обрабатывает `.css`, `.less`, `.scss`, fonts и svg;
- стили компонента не зависят от Storybook-only wrapper.

### Таблица не занимает нужную высоту

Используйте:

```text
PageWrapper
  SectionWrapper или GroupWrapper
    Table heightMode="fill"
```

Если нужен размер по содержимому, оставьте `heightMode="hug"`.

### Children не читаются в составном компоненте

Проверьте, что вложенный компонент имеет UXPin role/helper и parent wrapper умеет превращать children в runtime config. Примеры уже есть в:

- `Menu` + `MenuItem`;
- `Table` + `TableColumn`;
- `Toolbar` + `ToolbarButton`;
- `Dropdown` + `DropdownItem`;
- `Breadcrumbs` + `BreadcrumbItem`.

## 11. Полезные ссылки

- UXPin Merge integration guide: https://www.uxpin.com/docs/merge/integrating-your-own-components/
- UXPin Merge CLI: https://www.uxpin.com/docs/merge/cli-tool/
- JSX presets: https://www.uxpin.com/docs/merge/authoring-and-managing-jsx-presets/
