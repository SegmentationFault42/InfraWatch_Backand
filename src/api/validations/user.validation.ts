import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter pelo menos um caractere especial',
    );

const roleEnum = z.enum(['ADMIN', 'VIEWER', 'EDITOR']);

class UserValidation {
    createUserSchema = z.object({
        name: z
            .string()
            .min(1, 'Nome é obrigatório')
            .max(100, 'Nome muito longo'),
        email: z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim(),
        password: passwordSchema,
        role: roleEnum,
    });

    loginUserSchema = z.object({
        email: z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim(),
        password: z.string().min(1, 'Senha é obrigatória'),
    });

    updateUserSchema = z.object({
        name: z
            .string()
            .min(1, 'Nome é obrigatório')
            .max(100, 'Nome muito longo')
            .optional(),
        email: z
            .string()
            .email({ message: 'E-mail inválido' })
            .toLowerCase()
            .trim()
            .optional(),
        password: passwordSchema.optional(),
        role: roleEnum.optional(),
    });

    id = z.object({
        id: z.string().uuid('ID deve ser um UUID válido'),
    });
}

export const userValidation = new UserValidation();
