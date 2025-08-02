CREATE TABLE "routine_maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"facility" varchar NOT NULL,
	"event" varchar NOT NULL,
	"date_begun" date NOT NULL,
	"recurrence" varchar NOT NULL,
	"custom_recurrence" text,
	"room_number" varchar NOT NULL,
	"description" text NOT NULL,
	"created_by_id" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_performed" timestamp,
	"next_due" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "routine_maintenance_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"routine_maintenance_id" integer NOT NULL,
	"photo_url" varchar(2000) NOT NULL,
	"filename" varchar(500) NOT NULL,
	"original_filename" varchar(500),
	"file_path" varchar(2000),
	"mime_type" varchar(100),
	"size" integer,
	"caption" text,
	"uploaded_by_id" varchar NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "routine_maintenance" ADD CONSTRAINT "routine_maintenance_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_maintenance" ADD CONSTRAINT "routine_maintenance_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_maintenance_photos" ADD CONSTRAINT "routine_maintenance_photos_routine_maintenance_id_routine_maintenance_id_fk" FOREIGN KEY ("routine_maintenance_id") REFERENCES "public"."routine_maintenance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_maintenance_photos" ADD CONSTRAINT "routine_maintenance_photos_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;