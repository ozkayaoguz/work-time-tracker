import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogController } from './work-log.controller';
import { WorkLogService } from './work-log.service';

describe('WorkLogController', () => {
  let controller: WorkLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkLogController],
      providers: [{ provide: WorkLogService, useValue: jest.fn() }],
    }).compile();

    controller = module.get<WorkLogController>(WorkLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
