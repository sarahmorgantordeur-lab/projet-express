const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "Mot de passe trop faible"),
  role: z.enum(['USER', 'ADMIN']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

module.exports = { registerSchema, loginSchema };
