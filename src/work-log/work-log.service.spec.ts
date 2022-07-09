import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { createMockRepository } from '../utils/mock.repository';
import { StartWorkDto } from './dto/start-work.dto';
import { ActiveLogRecordNotFoundError } from './error/active-log-record-not-found.error';
import { LogRecordActiveError } from './error/log-record-active.error';
import { WorkLog } from './work-log.entity';
import { WorkLogRepository } from './work-log.repository';
import { WorkLogService } from './work-log.service';

const { repo, persist, flush } = createMockRepository<WorkLogRepository>();
repo.addLog = jest.fn();
repo.getActiveLog = () => Promise.resolve(null);

const userService: Partial<UserService> = {
  checkUserExists: jest.fn(),
};

describe('WorkLogService', () => {
  let service: WorkLogService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkLogService,
        { provide: WorkLogRepository, useValue: repo },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    service = module.get<WorkLogService>(WorkLogService);
  });

  describe('start log', () => {
    it('should create a new log', async () => {
      const id = 'c953d720-d14d-47c9-aa64-9b3f1964f64c';
      const dto: StartWorkDto = { description: 'test' };

      await service.startWork(id, dto);

      expect((repo.addLog as jest.Mock).mock.calls[0][0]).toEqual(id);
      expect((repo.addLog as jest.Mock).mock.calls[0][1]).toEqual(dto.description);
      expect((userService.checkUserExists as jest.Mock).mock.calls[0][0]).toEqual(id);
    });

    it('should throw error if there are another active log', async () => {
      const spy = jest
        .spyOn(repo, 'getActiveLog')
        .mockImplementation(() => Promise.resolve(new WorkLog()));

      const promise = service.startWork('', { description: '' });
      await expect(promise).rejects.toBeInstanceOf(LogRecordActiveError);

      spy.mockRestore();
    });
  });

  describe('close log', () => {
    it('should update end date', async () => {
      const log = new WorkLog();
      log.endedAt = new Date('2009');
      const date = new Date('2020');

      const spy = jest.spyOn(repo, 'getActiveLog').mockImplementation(() => Promise.resolve(log));

      await service.finishWork('');
      expect(flush.mock.calls.length).toEqual(1);
      expect(persist.mock.calls[0][0].endedAt.getTime()).toBeGreaterThan(date.getTime());

      spy.mockRestore();
    });

    it('should throw error if there are not active log', async () => {
      const promise = service.finishWork('');
      await expect(promise).rejects.toBeInstanceOf(ActiveLogRecordNotFoundError);
    });
  });
});
