import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { 
  InsertUser, 
  users,
  transactions,
  clients,
  documents,
  notifications,
  type Transaction,
  type Client,
  type Document,
  type Notification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = createPool({
        uri: process.env.DATABASE_URL,
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
      });

      _db = drizzle(pool);
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  return _db;
}

// ============ Authentication Functions ============

/**
 * Register a new user with email and password
 */
export async function registerUser(email: string, password: string, name: string, nomeEmpresa: string, cnpj: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error("Email already registered");
    }

    // Hash password (in production, use bcrypt)
    const hashedPassword = Buffer.from(password).toString('base64');

    // Generate openId for email-based registration
    const { nanoid } = await import('nanoid');
    const openId = nanoid();

    // Create user
    await db.insert(users).values({
      openId,
      email,
      password: hashedPassword,
      name,
      nomeEmpresa,
      cnpj,
      loginMethod: 'email',
      role: 'user',
      lastSignedIn: new Date(),
    });

    // Get the created user
    const createdUser = await getUserByEmail(email);
    return { success: true, userId: createdUser?.id || 0 };
  } catch (error) {
    console.error("[Database] Failed to register user:", error);
    throw error;
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    console.log("[Auth] Attempting to authenticate user with email:", email);
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    console.log("[Auth] Query result length:", result.length);
    
    if (result.length === 0) {
      console.log("[Auth] User not found for email:", email);
      throw new Error("User not found");
    }

    const user = result[0];
    
    // Hash password for comparison (in production, use bcrypt)
    const hashedPassword = Buffer.from(password).toString('base64');
    
    if (user.password !== hashedPassword) {
      throw new Error("Invalid password");
    }

    // Update last signed in
    await db.update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nomeEmpresa: user.nomeEmpresa,
      cnpj: user.cnpj,
      role: user.role,
    };
  } catch (error) {
    console.error("[Database] Failed to authenticate user:", error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.email) {
    throw new Error("User email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      email: user.email,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "loginMethod", "nomeEmpresa", "cnpj"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Transactions queries ============

export async function getTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.date));
}

export async function getTransactionsByUserAndMonth(userId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  return db.select().from(transactions).where(
    and(
      eq(transactions.userId, userId),
      gte(transactions.date, startDate),
      lte(transactions.date, endDate)
    )
  ).orderBy(desc(transactions.date));
}

export async function getTotalsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return { ganhos: 0, despesas: 0 };

  const result = await db.select().from(transactions).where(eq(transactions.userId, userId));
  
  let ganhos = 0;
  let despesas = 0;

  result.forEach((t: Transaction) => {
    const value = parseFloat(t.value as any);
    if (t.type === 'ganho') ganhos += value;
    else despesas += value;
  });

  return { ganhos, despesas };
}

export async function getAnnualEarnings(userId: number, year: number) {
  const db = await getDb();
  if (!db) return 0;

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const result = await db.select().from(transactions).where(
    and(
      eq(transactions.userId, userId),
      eq(transactions.type, 'ganho'),
      gte(transactions.date, startDate),
      lte(transactions.date, endDate)
    )
  );

  return result.reduce((sum, t) => sum + parseFloat(t.value as any), 0);
}

// ============ Clients queries ============

export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(clients).where(
    and(eq(clients.id, id), eq(clients.userId, userId))
  ).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Documents queries ============

export async function getDocumentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
}

export async function getUpcomingDocuments(userId: number, daysAhead: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return db.select().from(documents).where(
    and(
      eq(documents.userId, userId),
      gte(documents.dueDate, today),
      lte(documents.dueDate, futureDate),
      eq(documents.status, 'pendente')
    )
  ).orderBy(documents.dueDate);
}

// ============ Notifications queries ============

export async function getNotificationsByUserId(userId: number, unreadOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];

  const condition = unreadOnly 
    ? and(eq(notifications.userId, userId), eq(notifications.read, false))
    : eq(notifications.userId, userId);

  return db.select().from(notifications).where(condition).orderBy(desc(notifications.createdAt));
}

export async function createNotification(userId: number, title: string, message: string, type: 'boleto' | 'saldo' | 'faturamento' | 'geral') {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notifications).values({
    userId,
    title,
    message,
    type,
  });

  return result;
}

export async function markNotificationAsRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));

  return true;
}
