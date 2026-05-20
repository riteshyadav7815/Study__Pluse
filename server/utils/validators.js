const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const taskSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  notes: z.string().optional(),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(val + "T00:00:00");
        return inputDate >= today;
      },
      { message: "Date cannot be in the past" }
    ),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Completed", "Pending"]).optional(),
  actualHours: z.number().min(0).optional(),
  plannedHours: z.number().min(0).optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

const timetableSchema = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  repeatWeekly: z.boolean().optional(),
  color: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
  timetableSchema,
};
