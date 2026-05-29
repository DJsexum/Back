-- Create "Sin categoría" category if it doesn't exist
INSERT INTO categories (name, "createAt", "updatedAt") 
VALUES ('Sin categoría', NOW(), NOW())
ON CONFLICT DO NOTHING;
