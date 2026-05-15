import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('SGE - Sistema de Gestion Empresarial')
    .setDescription(`
## Descripcion
API RESTful para la gestion del Sistema de Gestion Empresarial (SGE).

## Autenticacion JWT
Para acceder a los endpoints protegidos, es necesario autenticarse primero:

1. **Obtener Token**: Realizar una peticion POST a \`/api/v1/auth/login\`
2. **Usar Token**: Incluir el token en el header de las peticiones:
   \`Authorization: Bearer <token>\`
3. **Tiempo de validez**: El token expira en 24 horas

## Codigos de Estado HTTP
- **200**: Exito
- **201**: Creado exitosamente
- **400**: Solicitud incorrecta (validacion fallida)
- **401**: No autorizado (token invalido o faltante)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Autenticacion y manejo de sesiones')
    .addTag('cliente', 'Operaciones CRUD para gestion de clientes')
    .addTag('sucursal', 'Operaciones CRUD para gestion de sucursales')
    .addTag('contacto-cliente', 'Operaciones CRUD para contactos de emergencia')
    .addTag('usuario', 'Operaciones CRUD para gestion de usuarios')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SGE - Documentacion API',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(3000);
  console.log('===========================================');
  console.log('Aplicacion corriendo en: http://localhost:3000');
  console.log('Documentacion API: http://localhost:3000/api/docs');
  console.log('===========================================');
}
bootstrap();
