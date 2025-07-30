ALTER TABLE "organizations" ADD COLUMN "image1_url" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "image2_url" varchar;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "building_image_url";