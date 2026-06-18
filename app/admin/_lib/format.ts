const ACTION_LABELS: Record<string, string> = {
  "login.success": "Вход выполнен",
  "login.failed": "Неудачная попытка входа",
  "login.locked": "Вход заблокирован (лимит попыток)",
  "login.inactive": "Попытка входа в отключённую учётную запись",
  logout: "Выход",
  "user.create": "Создан пользователь",
  "user.activate": "Пользователь включён",
  "user.deactivate": "Пользователь отключён",
  "user.reset_password": "Сброшен пароль пользователя",
  "user.change_password": "Изменён собственный пароль",
  "news.create": "Создана новость",
  "news.update": "Изменена новость",
  "news.publish": "Опубликована новость",
  "news.unpublish": "Новость снята с публикации",
  "news.delete": "Удалена новость",
  "media.upload": "Загружен файл",
  "media.delete": "Удалён файл",
  "sveden.create": "Добавлена запись «Сведений»",
  "sveden.update": "Изменена запись «Сведений»",
  "sveden.delete": "Удалена запись «Сведений»",
  "sveden.finances": "Изменены финансовые показатели",
  "sveden.section": "Изменён подраздел «Сведений»",
  "profile.update": "Изменён профиль организации",
};

export function auditActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "—";
  return dateTimeFmt.format(date);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} Б`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} КБ`;
  return `${(n / 1024 / 1024).toFixed(1)} МБ`;
}
