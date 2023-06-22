-- CreateEnum
CREATE TYPE "AIRPLANE_MODEL" AS ENUM ('BOEING_737');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "identity_number" VARCHAR(16) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pilots" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "pilots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(5) NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airplanes" (
    "id" VARCHAR(36) NOT NULL,
    "model" "AIRPLANE_MODEL" NOT NULL,
    "serial_number" INTEGER NOT NULL,

    CONSTRAINT "airplanes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" VARCHAR(36) NOT NULL,
    "number" SERIAL NOT NULL,
    "value" REAL NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "expected_arrival_date" TIMESTAMP(3) NOT NULL,
    "pilot_id" VARCHAR(36) NOT NULL,
    "departure_airport_id" VARCHAR(36) NOT NULL,
    "arrival_airport_id" VARCHAR(36) NOT NULL,
    "airline_id" VARCHAR(36) NOT NULL,
    "airplane_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" VARCHAR(36) NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "is_executive" BOOLEAN NOT NULL,
    "flight_id" TEXT NOT NULL,
    "reserved_by_id" VARCHAR(36),

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "pilots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplanes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_reserved_by_id_fkey" FOREIGN KEY ("reserved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
