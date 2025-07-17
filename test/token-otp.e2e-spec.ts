import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TokenOtpModule } from '../src/token-otp/token-otp.module';
import { RedisService } from '../src/token-otp/adapters/infrastructure/redis/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TokenOtpModule,
    ],
})
class TestAppModule { }

describe('TokenOtpController (e2e)', () => {
    let app: INestApplication;
    let redisService: RedisService;

    const mockRedisClient = {
        set: jest.fn().mockImplementation(() => Promise.resolve('OK')),
        get: jest.fn(),
        del: jest.fn(),
        quit: jest.fn().mockImplementation(() => Promise.resolve()),
        duplicate: jest.fn().mockReturnValue({
            connect: jest.fn().mockResolvedValue(true),
            subscribe: jest.fn().mockResolvedValue(true),
            unsubscribe: jest.fn().mockResolvedValue(true),
            disconnect: jest.fn().mockResolvedValue(true)
        }),
        configSet: jest.fn().mockResolvedValue('OK'),
        keys: jest.fn().mockResolvedValue([]),
        ttl: jest.fn().mockResolvedValue(300)
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule],
        })
            .overrideProvider(RedisService)
            .useValue({
                getClient: jest.fn().mockReturnValue(mockRedisClient),
                createDuplicate: jest.fn().mockReturnValue({
                    connect: jest.fn().mockResolvedValue(true),
                    subscribe: jest.fn().mockResolvedValue(true),
                    unsubscribe: jest.fn().mockResolvedValue(true),
                    disconnect: jest.fn().mockResolvedValue(true)
                })
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));

        app.setGlobalPrefix('api');

        await app.init();

        redisService = moduleFixture.get<RedisService>(RedisService);
    });

    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('/token-otp (POST)', () => {
        it('deve criar um token OTP e retornar 201', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123', expirationMinutes: 5 })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('expiresAt');
                    expect(res.body.token).toMatch(/^\d{6}$/);

                    expect(mockRedisClient.set).toHaveBeenCalled();
                });
        });

        it('deve retornar 400 quando userId não é fornecido', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ expirationMinutes: 5 })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeTruthy();
                    if (res.body.errors && Array.isArray(res.body.errors)) {
                        const hasUserIdError = res.body.errors.some(err =>
                            err.property === 'userId' || err.message.includes('userId')
                        );
                        expect(hasUserIdError).toBeTruthy();
                    }
                });
        });

        it('deve usar o tempo de expiração padrão (1 minuto) quando não especificado', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123' })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('expiresAt');
                });
        });


        it('deve aceitar userId com tamanho máximo (10 caracteres)', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '1234567890', expirationMinutes: 1 })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('expiresAt');
                });
        });

        it('deve retornar 400 quando userId excede o tamanho máximo', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '12345678901', expirationMinutes: 1 })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeDefined();
                    const hasMaxLengthError = res.body.message.find(
                        err => err.includes('userId') && err.includes('shorter')
                    );
                    expect(hasMaxLengthError).toBeTruthy();
                });
        });

        it('deve retornar 400 quando userId contém caracteres não numéricos', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123abc456', expirationMinutes: 1 })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeDefined();
                    const hasRegexError = res.body.message.find(
                        err => err.includes('userId') && err.includes('regular expression')
                    );
                    expect(hasRegexError).toBeTruthy();
                });
        });

        it('deve aceitar expirationMinutes no valor mínimo (1)', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 1 })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('expiresAt');
                });
        });

        it('deve aceitar expirationMinutes no valor máximo (5)', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 5 })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body).toHaveProperty('expiresAt');
                });
        });

        // Teste para expirationMinutes abaixo do mínimo
        it('deve retornar 400 quando expirationMinutes é menor que o mínimo', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 0 })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeDefined();
                    const hasMinError = res.body.message.find(
                        err => err.includes('expirationMinutes') && err.includes('not be less than 1')
                    );
                    expect(hasMinError).toBeTruthy();
                });
        });

        it('deve retornar 400 quando expirationMinutes é maior que o máximo', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 6 })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeDefined();
                    console.log(res.body.message);
                    const hasMaxError = res.body.message.find(
                        err => err.includes('expirationMinutes') && err.includes('not be greater than 5')
                    );
                    expect(hasMaxError).toBeTruthy();
                });
        });

        it('deve retornar 400 quando expirationMinutes não é um número', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 'dois' })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBeDefined();
                    const hasTypeError = res.body.message.find(
                        err => err.includes('expirationMinutes')
                    );
                    expect(hasTypeError).toBeTruthy();
                });
        });

        it('deve gerar um token com exatamente 6 dígitos', () => {
            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes: 1 })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('token');
                    expect(res.body.token).toMatch(/^\d{6}$/);
                });
        });

        it('deve definir a data de expiração corretamente', () => {
            const expirationMinutes = 3;
            const currentTime = new Date();

            return request(app.getHttpServer())
                .post('/api/token-otp')
                .send({ userId: '123456', expirationMinutes })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('expiresAt');

                    const expiresAt = new Date(res.body.expiresAt);
                    const expectedExpiration = new Date(currentTime.getTime() + expirationMinutes * 60000);

                    // Tolerância de 2 segundos para compensar o tempo de execução do teste
                    const timeDiff = Math.abs(expiresAt.getTime() - expectedExpiration.getTime());
                    expect(timeDiff).toBeLessThan(2000);
                });
        });
    });
});