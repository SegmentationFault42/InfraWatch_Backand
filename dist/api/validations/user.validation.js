"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');
class UserValidation {
    createUserSchema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Nome é obrigatório')
            .max(100, 'Nome muito longo'),
        email: zod_1.z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim(),
        password: passwordSchema,
        roleId: zod_1.z
            .string()
            .uuid('ID da role deve ser um UUID válido')
            .optional(),
    });
    loginUserSchema = zod_1.z.object({
        email: zod_1.z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim(),
        password: zod_1.z.string().min(1, 'Senha é obrigatória'),
    });
    updateUserSchema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Nome é obrigatório')
            .max(100, 'Nome muito longo')
            .optional(),
        email: zod_1.z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim()
            .optional(),
        password: passwordSchema.optional(),
        roleId: zod_1.z
            .string()
            .uuid('ID da role deve ser um UUID válido')
            .optional(),
    });
    idSchema = zod_1.z.object({
        id: zod_1.z.string().uuid('ID deve ser um UUID válido'),
    });
}
exports.userValidation = new UserValidation();
//# sourceMappingURL=user.validation.js.map