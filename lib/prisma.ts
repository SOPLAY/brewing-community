import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();

declare global {
  var prisma: PrismaClient;
}

export let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  global.prisma;
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query"],
    });
  }
  prisma = global.prisma;
}
