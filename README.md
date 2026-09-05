# Шесть рукопожатий — Flutter Web release

Эта папка является готовым статическим Flutter Web-сайтом для загрузки в
отдельный Git-репозиторий и последующего импорта в Vercel. Исходный Flutter,
backend, iOS/Android-проекты, ключи и приватные файлы сюда не входят.

Сборка создана в режиме `release` со значениями:

- `APP_ENV=production`
- `API_BASE_URL=https://85.192.37.204:18443`
- PWA service worker отключён, чтобы новая версия не застревала в старом кеше
- маршрутизация Flutter использует URL с `#`, поэтому SPA rewrite не требуется

## Проверка локально

Запускать `index.html` через `file://` нельзя. Используйте локальный HTTP-сервер:

```bash
cd /Users/griphinterner/Documents/six_hand_app_web_vercel
python3 -m http.server 8779 --bind 127.0.0.1
```

Откройте:

```text
http://127.0.0.1:8779/#/login
```

## Загрузка в Git

Создайте пустой репозиторий на GitHub/GitLab без автоматически созданных файлов,
затем выполните в этой папке:

```bash
git init
git add .
git commit -m "Deploy Flutter Web release"
git branch -M main
git remote add origin URL_ВАШЕГО_РЕПОЗИТОРИЯ
git push -u origin main
```

В эту папку не следует копировать `.env`, пароли, токены, приватные XLSX,
backend или исходный мобильный проект.

## Импорт в Vercel

1. В Vercel выберите **Add New → Project**.
2. Импортируйте созданный Git-репозиторий.
3. Выберите **Framework Preset: Other**.
4. Оставьте **Root Directory** равным корню репозитория.
5. Отключите/оставьте пустыми **Build Command** и **Install Command**.
6. Оставьте **Output Directory** пустым: сайт уже собран и лежит в корне.
7. Сначала создайте Preview deployment и проверьте его URL.
8. После проверки выполните Production deployment.

## Обязательная CORS-настройка API

Vercel размещает только frontend. Чтобы на публичном домене работали вход,
загрузка данных и realtime-синхронизация, точный HTTPS-origin Vercel должен быть
добавлен на production API в `ALLOWED_ORIGINS` без завершающего `/`.

Пример:

```text
https://six-handshakes.vercel.app
```

Для Preview deployment его временный URL также добавляется отдельно. Не
используйте `*`: приложение работает с авторизацией, а разрешать произвольные
сайты не следует.

После изменения `.env` на сервере применяется только API-контейнер:

```bash
cd /root/six-handshakes-production
./bin/docker-compose up -d --no-deps --force-recreate api
docker inspect --format='{{.State.Health.Status}}' six_handshakes_production-api-1
```

Ожидаемый статус: `healthy`.

Проверка CORS без пароля:

```bash
curl -i -X OPTIONS 'https://85.192.37.204:18443/api/v1/auth/login' \
  -H 'Origin: https://ВАШ-ДОМЕН.vercel.app' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Ответ должен содержать HTTP `200` и тот же домен в
`Access-Control-Allow-Origin`.

## При обновлении приложения

Эта папка содержит уже скомпилированный JavaScript. Изменение Environment
Variables в Vercel не меняет `APP_ENV` или `API_BASE_URL` внутри существующей
сборки. Для обновления требуется заново выполнить `flutter build web --release`,
заменить содержимое этой папки и отправить новый commit.
