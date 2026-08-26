Сюда кладутся обложки постов (сгенерированные, например, через Gemini).

Имя файла = slug поста (имя файла в content/posts/, без .md) + .jpg:

  content/posts/utro.md          -> public/images/covers/utro.jpg
  content/posts/pervyi-sneg.md   -> public/images/covers/pervyi-sneg.jpg
  content/posts/stary-dvor.md    -> public/images/covers/stary-dvor.jpg
  content/posts/vecher-na-reke.md -> public/images/covers/vecher-na-reke.jpg

После того как файл положен сюда, в frontmatter соответствующего поста
должно быть поле:

  cover: "/images/covers/<slug>.jpg"

(у трёх из четырёх демо-постов оно уже прописано и ждёт файл; у "utro" —
специально оставлено пустым, чтобы показать, что без обложки вёрстка
не ломается).

Рекомендуемые пропорции: широкое изображение (примерно 16:9 или шире) —
на странице поста обложка растягивается на всю ширину блока текста
(aspect-video), в ленте на главной — квадратом ~128×128 (обрежется по
центру через object-cover, так что композиция должна нормально
смотреться и при квадратной обрезке).

CMS-редактор (Decap) для загрузки картинок через веб-интерфейс ещё не
настроен — это следующий этап. Пока файлы кладутся сюда вручную (по
git — добавить файл, закоммитить, запушить, дождаться деплоя, либо
через SSH/SCP прямо на сервер в public/images/covers/).
