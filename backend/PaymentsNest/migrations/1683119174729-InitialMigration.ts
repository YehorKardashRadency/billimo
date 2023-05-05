import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683119174729 implements MigrationInterface {
    name = 'InitialMigration1683119174729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."plaid_transfer_eventtype_enum" AS ENUM('pending', 'cancelled', 'failed', 'posted', 'settled', 'returned', 'swept', 'swept_settled', 'return_swept')`);
        await queryRunner.query(`CREATE TABLE "plaid_transfer" ("id" SERIAL NOT NULL, "transferId" text NOT NULL, "transactionId" integer NOT NULL, "buyer" boolean NOT NULL, "eventType" "public"."plaid_transfer_eventtype_enum" NOT NULL, "transactionStatusUpdated" boolean NOT NULL, CONSTRAINT "PK_cbcbade79e76872ef9da6227b07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "billId" bigint NOT NULL, "amount" numeric NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "buyerId" integer NOT NULL, "sellerId" integer NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_statistic_tabtype_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "payment_statistic" ("id" SERIAL NOT NULL, "paid" numeric NOT NULL, "forPayment" numeric NOT NULL, "tabType" "public"."payment_statistic_tabtype_enum" NOT NULL DEFAULT '0', "companyId" integer, CONSTRAINT "PK_7360945ec096d8a646003ba309f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "postponed_payment_info" ("id" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "accountId" character varying NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying NOT NULL, "transactionId" integer NOT NULL, CONSTRAINT "REL_d7d31aa841d527ae7db084cac0" UNIQUE ("transactionId"), CONSTRAINT "PK_369c7328e79389647a79fa22583" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."postponed_payment_postponedpaymenttype_enum" AS ENUM('Deposit', 'Withdrawal')`);
        await queryRunner.query(`CREATE TABLE "postponed_payment" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL, "description" text NOT NULL, "payDate" date NOT NULL, "paid" boolean NOT NULL DEFAULT false, "postponedPaymentInfoId" integer NOT NULL, "postponedPaymentType" "public"."postponed_payment_postponedpaymenttype_enum" NOT NULL, CONSTRAINT "PK_4d8f55c58d6af2b127107e3a692" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plaid_transfers_event_sync" ("id" SERIAL NOT NULL, "lastEventId" integer NOT NULL, CONSTRAINT "PK_bd8c5f57f8756f302cbaa15fb14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plaid_transfer" ADD CONSTRAINT "FK_bb5b7415d8ccc4f8d638793738b" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5" FOREIGN KEY ("buyerId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_da429de57e23852dae37f1d182b" FOREIGN KEY ("sellerId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_statistic" ADD CONSTRAINT "FK_1d8a485a8db7bd97d90c611a716" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postponed_payment_info" ADD CONSTRAINT "FK_d7d31aa841d527ae7db084cac04" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postponed_payment" ADD CONSTRAINT "FK_a4a571591bdfd154cd21dbda22e" FOREIGN KEY ("postponedPaymentInfoId") REFERENCES "postponed_payment_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "postponed_payment" DROP CONSTRAINT "FK_a4a571591bdfd154cd21dbda22e"`);
        await queryRunner.query(`ALTER TABLE "postponed_payment_info" DROP CONSTRAINT "FK_d7d31aa841d527ae7db084cac04"`);
        await queryRunner.query(`ALTER TABLE "payment_statistic" DROP CONSTRAINT "FK_1d8a485a8db7bd97d90c611a716"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_da429de57e23852dae37f1d182b"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5"`);
        await queryRunner.query(`ALTER TABLE "plaid_transfer" DROP CONSTRAINT "FK_bb5b7415d8ccc4f8d638793738b"`);
        await queryRunner.query(`DROP TABLE "plaid_transfers_event_sync"`);
        await queryRunner.query(`DROP TABLE "postponed_payment"`);
        await queryRunner.query(`DROP TYPE "public"."postponed_payment_postponedpaymenttype_enum"`);
        await queryRunner.query(`DROP TABLE "postponed_payment_info"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "payment_statistic"`);
        await queryRunner.query(`DROP TYPE "public"."payment_statistic_tabtype_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TABLE "plaid_transfer"`);
        await queryRunner.query(`DROP TYPE "public"."plaid_transfer_eventtype_enum"`);
    }

}
