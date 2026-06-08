const { z } = require('zod');

// Schema for loan application creation
const createApplicationSchema = z.object({
  applicant_name: z
    .string({ required_error: 'Applicant name is required' })
    .trim()
    .min(2, 'Applicant name must be at least 2 characters')
    .max(100, 'Applicant name must not exceed 100 characters'),
  
  mobile_number: z
    .string({ required_error: 'Mobile number is required' })
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Invalid mobile number. Must be a 10-digit number starting with 6-9'),
  
  loan_amount: z
    .union([z.number(), z.string()])
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, 'Loan amount must be a number greater than 0')
    .refine((val) => val <= 100000000, 'Loan amount must not exceed ₹100,000,000 (10 Cr)'),
  
  loan_purpose: z
    .string({ required_error: 'Loan purpose is required' })
    .trim()
    .min(5, 'Loan purpose must describe the intent in at least 5 characters')
    .max(1000, 'Loan purpose must not exceed 1000 characters'),
  
  preferred_language: z
    .enum(['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'], {
      errorMap: () => ({ message: 'Preferred language must be Hindi, Tamil, Telugu, Marathi, or English' }),
    }),
});

// Schema for status update
const updateStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    errorMap: () => ({ message: 'Status must be pending, approved, or rejected' }),
  }),
});

// Helper validation middleware
const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});
      
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details,
        },
      });
    }
    next(error);
  }
};

module.exports = {
  validateCreateApplication: validateBody(createApplicationSchema),
  validateUpdateStatus: validateBody(updateStatusSchema),
};
