# Six Handshakes — Vercel release

Это готовая статическая Flutter Web release-сборка для репозитория
`GriphinTerner/six_hand`. Внутри уже зашит production API:

`https://193.233.221.103:18443`

## Что делать

Папка уже является Git-репозиторием с origin на нужный GitHub-репозиторий.
Откройте Terminal в этой папке и выполните ровно один коммит и push:

```bash
git add -A
git commit -m "Deploy web release with new production API"
git push origin main
```

После push Vercel автоматически создаст новый production deployment для
`https://six-hand.vercel.app`.

## Важно

- Не загружайте папку как ZIP-архив: Vercel должен увидеть файлы в корне Git-репозитория.
- Не изменяйте `vercel.json` и не задавайте Build Command: сайт уже собран.
- В пакет включён одноразовый service worker migration. Он удалит старый Flutter PWA-кэш у ранее открывавших сайт пользователей, чтобы они получили актуальный JavaScript и новый IP API.
- CORS для `https://six-hand.vercel.app` уже разрешён сервером API.
