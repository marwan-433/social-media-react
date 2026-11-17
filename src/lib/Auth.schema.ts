import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is requierd")
      .min(3, "min chars is 3")
      .max(10, "max chars is 10"),

    username: z
      .string()
      .nonempty("userName is requierd")
      .min(3, "min chars is 3")
      .max(10, "max chars is 10"),

    email: z.string().nonempty("Email is requierd").email("Email is not found"),

    dateOfBirth: z
      .string()
      .nonempty("Date of birth is required")
      .refine((date) => {
        const currentDate = new Date().getFullYear();
        const userYear = new Date(date).getFullYear();
        const age = currentDate - userYear;

        return age >= 18;
      }, "Age must be greater than 18"),

    gender: z.string().nonempty("Gender is requierd"),

    password: z
      .string()
      .nonempty("Password is requierd")
      .min(3, "min chars is 3")
      .max(15, "max chars is 15"),

    rePassword: z.string().nonempty("Repassword is requierd"),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Passwords not macth",
    },
  );

export const loginSchema = z.object({
  email: z.string().nonempty("Email is requierd").email("Email is not found"),

  password: z
    .string()
    .nonempty("Password is requierd")
    .min(3, "min chars is 3")
    .max(15, "max chars is 15"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
