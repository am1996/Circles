import { z } from "zod";

const hasUppercaseChar = (data) => /[A-Z]/.test(data);
const hasAlphanumericChar = (data) => /\w/.test(data);
const hasNumber = (data) => /\d/.test(data);

export const RegisterUserSchema = z.object({
    fullname: z.string({
        required_error: "Fullname is required",
        invalid_type_error: "Fullname must be a string",
    }).min(2, { message: "Fullname is required." }),
    email: z.string().email({ message: "Invalid Email address." }),
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(5, { message: "Username must be at least 5 characters long." }),
    password: z.string().min(8, { message: "Password must be at least 8 characeters long." })
        .refine(hasUppercaseChar, { message: "Password must contain at least one uppercase character" })
        .refine(hasAlphanumericChar, { message: "Password must contain at least one alphanumeric character" })
        .refine(hasNumber, { message: "Password must contain at least one number" }),
    repeatpassword: z.string().min(8, { message: "Repeat Password must be at least 8 characeters long." }),
}).superRefine(({ password, repeatpassword }, ctx) => {
    if (password != repeatpassword) {
        ctx.addIssue({
            code: "password_mismatch",
            message: "Passwords must match",
            path: ["repeatpassword"],
        });
    }
});

export const LogInUserSchema = z.object({
    email: z.string().email({ message: "Invalid Email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characeters long." })
        .refine(hasUppercaseChar, { message: "Password must contain at least one uppercase character" })
        .refine(hasAlphanumericChar, { message: "Password must contain at least one alphanumeric character" })
        .refine(hasNumber, { message: "Password must contain at least one number" }),
});