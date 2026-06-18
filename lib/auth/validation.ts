import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Введите корректный email" }),
  password: z.string().min(1, { error: "Введите пароль" }),
});

export const passwordSchema = z
  .string()
  .min(10, { error: "Пароль должен быть не короче 10 символов" })
  .max(200, { error: "Слишком длинный пароль" });

export const createUserSchema = z.object({
  email: z.email({ error: "Введите корректный email" }),
  fullName: z
    .string()
    .min(2, { error: "Укажите ФИО (минимум 2 символа)" })
    .max(120, { error: "Слишком длинное имя" }),
  role: z.enum(["ADMIN", "EDITOR"], { error: "Выберите роль" }),
  password: passwordSchema,
});
