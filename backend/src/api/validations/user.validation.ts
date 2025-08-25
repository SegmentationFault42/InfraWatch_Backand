import { z } from 'zod';

const RoleEnum = z.enum(['viewer', 'admin', 'editor']);
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

class UserValidation {
    createUserSchema = z.object({
        email: z.string().email({ message: 'E-mail inválido' }),
        senha: passwordSchema,
        first_name: z.string().max(50, { message: 'Nome muito longo' }),
        last_name: z.string().max(50, { message: 'Sobrenome muito longo' }),
        profile_image_url: z
            .string()
            .url({ message: 'URL inválida' })
            .optional(),
        role: z.enum(['admin', 'editor', 'viewer']),
    });

    loginUser = z.object({
        email: z.string().email({ message: 'E-mail inválido' }),
        senha: z.string().nonempty(),
    });
}

export const userValidation = new UserValidation();
