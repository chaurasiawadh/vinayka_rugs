import { z } from 'zod';

// Shared Schemas
export const emailSchema = z
  .string()
  .email({ message: 'Invalid email address' });
export const phoneSchema = z
  .string()
  .min(10, { message: 'Phone number must be at least 10 digits' })
  .regex(/^\+?[0-9\s-]{10,}$/, { message: 'Invalid phone number format' });
export const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters' });

// Contact Form Schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, { message: 'Please select a subject' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' }),
});

// Appointment Modal Schema
export const appointmentSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  type: z.enum(['virtual', 'in-store'], {
    message: 'Please select an appointment type',
  }),
  notes: z.string().optional(),
});

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// User Profile Schema
export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  // Add other fields as necessary
});

// Admin Product Schema (Basic)
export const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name is required' }),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  description: z.string().min(10),
  category: z.string().min(1),
  // Add more fields matching Product type
});
