/**
 * Database utilities implemented with Prisma Client.
 *
 * NOTE: This file assumes you will install `prisma` and `@prisma/client` and
 * run `npx prisma migrate dev` to create the SQLite database.
 *
 * All operations use Prisma's query methods which are parameterized (no raw string concatenation).
 */

import { PrismaClient, User as PrismaUser, Task as PrismaTask } from '@prisma/client';

declare global {
  // Allow global prisma to avoid multiple instances in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export type User = PrismaUser;
export type Task = PrismaTask;

export async function createUser(data: {
  username: string;
  email: string;
  password_hash: string;
}): Promise<User> {
  // Uses Prisma create which binds parameters safely
  return await prisma.user.create({ data });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { username } });
}

export async function findUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

export async function listUsers(): Promise<User[]> {
  return await prisma.user.findMany({ orderBy: { created_at: 'desc' } });
}

// Task helpers — always filter by userId to ensure users access only their tasks
export async function createTask(data: {
  userId: string;
  text: string;
  due_date?: Date | null;
}): Promise<Task> {
  return await prisma.task.create({ data: { userId: data.userId, text: data.text, due_date: data.due_date ?? null } });
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  return await prisma.task.findMany({ where: { userId }, orderBy: { created_at: 'desc' } });
}

export async function getTaskByIdForUser(id: string, userId: string): Promise<Task | null> {
  return await prisma.task.findFirst({ where: { id, userId } });
}

export async function updateTaskForUser(id: string, userId: string, updates: { text?: string; due_date?: Date | null }): Promise<Task | null> {
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return null;
  return await prisma.task.update({ where: { id }, data: updates });
}

export async function deleteTaskForUser(id: string, userId: string): Promise<Task | null> {
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return null;
  return await prisma.task.delete({ where: { id } });
}

