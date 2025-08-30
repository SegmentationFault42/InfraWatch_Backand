import { z } from 'zod';
declare class UserValidation {
    createUserSchema: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        roleId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    loginUserSchema: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    updateUserSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        roleId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    idSchema: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}
export declare const userValidation: UserValidation;
export {};
//# sourceMappingURL=user.validation.d.ts.map