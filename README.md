# NYX Messenger website

Обновлённые главные страницы RU/EN на основе последней версии сайта NYX.
Сохранена структура исходного архива: FAQ и юридические документы для обеих языковых версий.

## Структура
- `/ru/` — главная на русском языке
- `/en/` — главная на английском языке
- `/ru/faq/`, `/en/faq/` — FAQ
- `/ru/contact/`, `/en/contact/` — страница контактов (GitHub, Telegram, Email)
- `/ru/legal/`, `/en/legal/` — раздел документов
- `/ru/legal/policy/`, `/agreement/`, `/consent/` — юридические документы RU
- `/en/legal/policy/`, `/agreement/`, `/consent/` — юридические документы EN
- `/assets/` — логотипы и иконки сайта

Главные страницы включают адаптивную верстку, анимированный фон и локальный музыкальный плеер. Выбранные аудиофайлы воспроизводятся в браузере с устройства посетителя и не отправляются на сервер.

Загрузите содержимое папки `nyx_messenger_site` в корень веб-сайта. Папку `assets` необходимо сохранить в корне.


## Windows downloads

- Installer: `downloads/NYX_Setup.exe`
- Portable build: `downloads/NYX_Portable.zip`

The interactive chat on the landing page is a local-only visual demo. Messages are added to the page in the browser and are not sent to the NYX server or stored after the page is closed.
