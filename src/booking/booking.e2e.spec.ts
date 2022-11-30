import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../config/typeorm.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { bookingModuleConfig } from './booking.module';

describe('events', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      ...bookingModuleConfig,
      imports: [
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        ...bookingModuleConfig.imports,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // await app.close(); -- SQLITE_MISUSE: Database handle is closed
  });

  it(`GET /booking`, async () => {
    const response = await request(app.getHttpServer())
      .get('/booking')
      .expect(200);

    const result = response.body;

    expect(result[0].isAvailable).toBe(true);
    expect(result[1].isAvailable).toBe(true);
    expect(result[2].isAvailable).toBe(true);
  });

  it(`POST /booking Failed`, async () => {
    const body = {
      buId: 2,
      date: '2020-12-01',
      time: '13:00',
      contacts: [
        {
          email: 'test@test.com',
          firstname: 'aaaa',
          lastname: 'bbbb',
        },
      ],
    };
    await request(app.getHttpServer()).post('/booking').send(body).expect(400);
  });

  it(`POST /booking`, async () => {
    const body = {
      buId: 2,
      date: '2022-12-05',
      time: '13:00',
      contacts: [
        {
          email: 'test@test.com',
          firstname: 'e2e-test',
          lastname: 'e2e-test',
        },
      ],
    };
    const response = await request(app.getHttpServer())
      .post('/booking')
      .send(body);

    expect(
      response.statusCode === 201 || response.statusCode === 409,
    ).toBeTruthy();
  });
});
