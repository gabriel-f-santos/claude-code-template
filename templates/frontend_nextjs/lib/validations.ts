/**
 * 🛡️ Validation Schemas for Next.js Vibecoding
 * Centralized Zod schemas for forms and API validation.
 */

import { z } from 'zod';

// Email validation helper
const emailSchema = z.string().email('Email inválido');

// Password validation with strong requirements
const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
  .regex(/\d/, 'Senha deve ter pelo menos um número')
  .regex(/[^a-zA-Z0-9]/, 'Senha deve ter pelo menos um caractere especial');

// Authentication Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data: { password: string; confirm_password: string }) => data.password === data.confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password'],
  });

// Profile update schema
export const profileUpdateSchema = z.object({
  email: emailSchema.optional(),
  full_name: z.string().max(100, 'Nome muito longo').optional(),
  bio: z.string().max(500, 'Bio muito longa').optional(),
  avatar_url: z.string().url('URL inválida').optional(),
});

// Password change schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Senha atual é obrigatória'),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data: { new_password: string; confirm_password: string }) => data.new_password === data.confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password'],
  });


// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;


// Validation error helpers
export const formatZodError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
};

// Field validation helpers
export const validateField = {
  email: (email: string): boolean => validationPatterns.email.test(email),
  strongPassword: (password: string): boolean => validationPatterns.strongPassword.test(password),
  passwordsMatch: (password: string, confirmPassword: string): boolean => password === confirmPassword,
};

// Real-time validation messages
export const getValidationMessage = {
  email: (email: string): string | null => {
    if (!email) return 'Email é obrigatório';
    if (!validateField.email(email)) return 'Email inválido';
    return null;
  },
  
  password: (password: string): string | null => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
    if (!/[a-z]/.test(password)) return 'Senha deve ter pelo menos uma letra minúscula';
    if (!/[A-Z]/.test(password)) return 'Senha deve ter pelo menos uma letra maiúscula';
    if (!/\d/.test(password)) return 'Senha deve ter pelo menos um número';
    if (!/[^a-zA-Z0-9]/.test(password)) return 'Senha deve ter pelo menos um caractere especial';
    return null;
  },
  
  confirmPassword: (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Confirmação de senha é obrigatória';
    if (password !== confirmPassword) return 'Senhas não conferem';
    return null;
  },
};