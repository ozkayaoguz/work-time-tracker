import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from '../database/connection';
import { ConnectionMock } from '../database/connection-mock';
import { UserService } from '../user/user.service';
import { StartWorkDto } from './dto/start-work.dto';
import { WorkLogDto } from './dto/work-log.dto';
import { ActiveLogRecordNotFoundError } from './error/active-log-record-not-found.error';
import { LogRecordActiveError } from './error/log-record-active.error';
import { WorkLogRepository } from './work-log.repository';
import { WorkLogService } from './work-log.service';

const connection = new ConnectionMock();
const repo = connection.getRepo<WorkLogRepository>();
repo.addLog = jest.fn();
repo.getActiveLog = () => Promise.resolve(null);
repo.finishLog = jest.fn((id) => Promise.resolve(null));

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
        { provide: Connection, useValue: connection },
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
        .mockImplementation(() => Promise.resolve(new WorkLogDto()));

      const promise = service.startWork('', { description: '' });
      await expect(promise).rejects.toBeInstanceOf(LogRecordActiveError);

      spy.mockRestore();
    });
  });

  describe('finish work', () => {
    it('should update end date', async () => {
      const log = new WorkLogDto();
      log.id = '6f728584-549c-4701-a82b-419aa8400bf0';
      const userId = 'f80854c9-c265-4e7d-bfd3-8bdf5733e0f3';

      jest.spyOn(repo, 'getActiveLog').mockResolvedValueOnce(log);

      await service.finishWork(userId);
      expect((repo.finishLog as jest.Mock).mock.calls[0][0]).toEqual(log.id);
      expect((userService.checkUserExists as jest.Mock).mock.calls[0][0]).toEqual(userId);
    });

    it('should throw error if there are not active log', async () => {
      const promise = service.finishWork('');
      await expect(promise).rejects.toBeInstanceOf(ActiveLogRecordNotFoundError);
    });
  });
});
