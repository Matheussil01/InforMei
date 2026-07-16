import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  getTransactionsByUserId, 
  getTransactionsByUserAndMonth,
  getTotalsByUserId,
  getAnnualEarnings,
  getClientsByUserId,
  getDocumentsByUserId,
  getUpcomingDocuments,
  getNotificationsByUserId,
  createNotification,
  markNotificationAsRead,
  registerUser,
  authenticateUser,
  getUserById
} from "./db";
import { getDb } from "./db";
import { transactions, clients, documents, notifications } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        try {
          const user = await authenticateUser(input.email, input.password);
          return {
            success: true,
            user,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Login failed");
        }
      }),
    
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        nome: z.string().min(2),
        nomeEmpresa: z.string().min(2),
        cnpj: z.string().min(11),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await registerUser(
            input.email,
            input.password,
            input.nome,
            input.nomeEmpresa,
            input.cnpj
          );
          return {
            success: true,
            userId: result.userId,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Registration failed");
        }
      }),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard & Financial
  dashboard: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const totals = await getTotalsByUserId(userId);
      const annualEarnings = await getAnnualEarnings(userId, new Date().getFullYear());
      
      return {
        saldo: totals.ganhos - totals.despesas,
        receitas: totals.ganhos,
        despesas: totals.despesas,
        faturamentoAnual: annualEarnings,
        limiteAnual: 81000,
      };
    }),

    getMonthlyData: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        const transactionsList = await getTransactionsByUserAndMonth(userId, input.year, input.month);
        
        const data = transactionsList.map(t => ({
          date: new Date(t.date).toLocaleDateString("pt-BR"),
          type: t.type,
          value: parseFloat(t.value as any),
        }));

        return data;
      }),

    getRecentTransactions: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const transactionsList = await getTransactionsByUserId(userId);
      return transactionsList.slice(0, 5);
    }),
  }),

  // Transactions
  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getTransactionsByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        description: z.string(),
        type: z.enum(["ganho", "despesa"]),
        value: z.number().positive(),
        date: z.date(),
        category: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(transactions).values({
          userId: ctx.user.id,
          description: input.description,
          type: input.type,
          value: input.value.toString(),
          date: input.date,
          category: input.category,
        });

        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        description: z.string().optional(),
        type: z.enum(["ganho", "despesa"]).optional(),
        value: z.number().positive().optional(),
        date: z.date().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updateData: Record<string, any> = {};
        if (input.description) updateData.description = input.description;
        if (input.type) updateData.type = input.type;
        if (input.value) updateData.value = input.value.toString();
        if (input.date) updateData.date = input.date;
        if (input.category) updateData.category = input.category;

        await db.update(transactions)
          .set(updateData)
          .where(and(eq(transactions.id, input.id), eq(transactions.userId, ctx.user.id)));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(transactions)
          .where(and(eq(transactions.id, input.id), eq(transactions.userId, ctx.user.id)));

        return { success: true };
      }),
  }),

  // Clients
  clients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getClientsByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(clients).values({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          notes: input.notes,
        });

        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updateData: Record<string, any> = {};
        if (input.name) updateData.name = input.name;
        if (input.email) updateData.email = input.email;
        if (input.phone) updateData.phone = input.phone;
        if (input.address) updateData.address = input.address;
        if (input.notes) updateData.notes = input.notes;

        await db.update(clients)
          .set(updateData)
          .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(clients)
          .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));

        return { success: true };
      }),
  }),

  // Documents
  documents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getDocumentsByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(["boleto", "nf", "recibo", "outro"]),
        dueDate: z.date(),
        value: z.number(),
        status: z.enum(["pago", "pendente", "vencido"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(documents).values({
          userId: ctx.user.id,
          name: input.name,
          type: input.type,
          dueDate: input.dueDate,
          value: input.value.toString(),
          status: input.status,
        });

        return result;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(documents)
          .where(and(eq(documents.id, input.id), eq(documents.userId, ctx.user.id)));

        return { success: true };
      }),

    getUpcoming: protectedProcedure.query(async ({ ctx }) => {
      return getUpcomingDocuments(ctx.user.id, 5);
    }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotificationsByUserId(ctx.user.id);
    }),

    getUnread: protectedProcedure.query(async ({ ctx }) => {
      return getNotificationsByUserId(ctx.user.id, true);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return markNotificationAsRead(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
