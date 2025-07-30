DROP TABLE "facility_users" CASCADE;--> statement-breakpoint
DROP TABLE "invitations" CASCADE;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "building_image_url" varchar;