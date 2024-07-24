CREATE TABLE IF NOT EXISTS "ExpenseTracker_users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(256),
	"email" varchar(256),
	"emailVerified" boolean,
	"provider" varchar(256),
	"password" varchar(256),
	"picture" varchar,
	CONSTRAINT "ExpenseTracker_users_email_unique" UNIQUE("email")
);
