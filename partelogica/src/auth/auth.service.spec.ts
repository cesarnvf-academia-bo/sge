import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/usuario.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usuarioService: UsuarioService;
  let jwtService: JwtService;

  const mockUsuario: Usuario = {
    id: 1,
    usuario: 'cesar',
    clave: '$2b$10$hashedpassword',
  };

  const mockUsuarioService = {
    validatePassword: jest.fn(),
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar token JWT cuando las credenciales son validas', async () => {
      const loginDto = { usuario: 'cesar', clave: '123qwe' };
      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      mockUsuarioService.validatePassword.mockResolvedValue(true);
      mockUsuarioService.findByUsername.mockResolvedValue(mockUsuario);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: expectedToken,
        token_type: 'Bearer',
        expires_in: 86400,
      });
      expect(mockUsuarioService.validatePassword).toHaveBeenCalledWith('cesar', '123qwe');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'cesar',
      });
    });

    it('debe retornar null cuando el usuario no existe', async () => {
      const loginDto = { usuario: 'inexistente', clave: '123qwe' };

      mockUsuarioService.validatePassword.mockResolvedValue(false);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
    });

    it('debe retornar null cuando la contrasena es incorrecta', async () => {
      const loginDto = { usuario: 'cesar', clave: 'wrongpassword' };

      mockUsuarioService.validatePassword.mockResolvedValue(false);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
    });

    it('debe retornar null cuando findByUsername no encuentra usuario', async () => {
      const loginDto = { usuario: 'cesar', clave: '123qwe' };

      mockUsuarioService.validatePassword.mockResolvedValue(true);
      mockUsuarioService.findByUsername.mockResolvedValue(null);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('debe retornar usuario cuando el payload es valido', async () => {
      const payload = { sub: 1, username: 'cesar' };

      mockUsuarioService.findByUsername.mockResolvedValue(mockUsuario);

      const result = await service.validateUser(payload);

      expect(result).toEqual(mockUsuario);
      expect(mockUsuarioService.findByUsername).toHaveBeenCalledWith('cesar');
    });

    it('debe retornar null cuando el usuario no existe', async () => {
      const payload = { sub: 999, username: 'inexistente' };

      mockUsuarioService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser(payload);

      expect(result).toBeNull();
    });
  });
});
