INSERT INTO cliente (nombre, apellido, ci, telefono, email, direccion)
VALUES
    ('Juan', 'Perez', '123456', '77711111', 'juan@gmail.com', 'La Paz'),
    ('Maria', 'Lopez', '654321', '77722222', 'maria@gmail.com', 'Cochabamba'),
    ('Carlos', 'Quispe', '987654', '77733333', 'carlos@gmail.com', 'Oruro');

INSERT INTO sucursal (nombre, direccion, ciudad, telefono)
VALUES
    ('Sucursal Central', 'Av. Siempre Viva', 'La Paz', '2221111'),
    ('Sucursal Norte', 'Zona Norte', 'Cochabamba', '3332222'),
    ('Sucursal Sur', 'Zona Sur', 'Santa Cruz', '4443333');

INSERT INTO contacto_cliente (cliente_id, tipo, nombre, telefono)
VALUES
    (1, 'Emergencia', 'Ana Perez', '70000001'),
    (2, 'Familiar', 'Luis Lopez', '70000002');

INSERT INTO usuario (usuario, clave)
VALUES
    ('cesar', '$2b$10$4GBlDg6dBGNlIlrk9OZA7u5kpHSp91rMonLaDTmuzV.T/tzfbO6ym'),
    ('nilton', '$2b$10$4GBlDg6dBGNlIlrk9OZA7u5kpHSp91rMonLaDTmuzV.T/tzfbO6ym');
