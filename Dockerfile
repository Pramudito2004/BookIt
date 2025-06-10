# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json, lalu install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema agar bisa digenerate di dalam container
COPY prisma ./prisma

# Jalankan prisma generate agar @prisma/client ter‐generate sebelum build Next.js
RUN npx prisma generate

# Copy sisa kode (source) ke dalam container
COPY . .

# Build Next.js (ini akan membutuhkan Prisma Client yang sudah ter‐generate)
RUN npm run build

# Agar Next.js bisa membaca file .env saat runtime, pastikan .env ikut dicopy.
# (Karena kita sudah COPY . . di atas, .env otomatis akan masuk.)

# Expose port default Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
