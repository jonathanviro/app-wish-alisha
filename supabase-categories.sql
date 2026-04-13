-- Agregar columna category a la tabla gifts
ALTER TABLE gifts ADD COLUMN category TEXT DEFAULT 'essential' 
CHECK (category IN ('essential', 'optional', 'detail'));

-- Actualizar los regalos existentes con sus categorías
UPDATE gifts SET category = 'essential' WHERE name = 'Cuna convertible';
UPDATE gifts SET category = 'essential' WHERE name = 'Silla de auto';
UPDATE gifts SET category = 'essential' WHERE name = 'Mecedora';
UPDATE gifts SET category = 'optional' WHERE name = 'Kit de baño';
UPDATE gifts SET category = 'optional' WHERE name = 'Monitor de bebé';
UPDATE gifts SET category = 'optional' WHERE name = 'Colchón de bebé';
UPDATE gifts SET category = 'detail' WHERE name = 'Set de ropa inicial';
UPDATE gifts SET category = 'detail' WHERE name = 'Sterilizer y Calienta-biberones';
