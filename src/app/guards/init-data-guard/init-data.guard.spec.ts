import { TestBed } from '@angular/core/testing';
import { InitDataGuard } from './init-data.guard';
import { AuthFacadeService } from '@budget-tracker/auth';
import { DataInitFacadeService } from '@budget-tracker/data';
import { firstValueFrom, of } from 'rxjs';

describe('InitDataGuard', () => {
  let guardUnderTest: InitDataGuard;

  let authFacade: AuthFacadeService;
  let dataInitFacade: DataInitFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacadeService, useValue: {} },
        { provide: DataInitFacadeService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    guardUnderTest = TestBed.inject(InitDataGuard);

    authFacade = TestBed.inject(AuthFacadeService);
    authFacade.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(of(true));

    dataInitFacade = TestBed.inject(DataInitFacadeService);
    dataInitFacade.isDataLoaded = jasmine.createSpy('isDataLoaded').and.returnValue(of(true));
    dataInitFacade.initData = jasmine.createSpy('initData');
  });

  it('should be created', () => {
    expect(guardUnderTest).toBeTruthy();
  });

  describe('#canActivate', () => {
    [
      {
        isLoggedIn: true,
        isDataLoaded: true,
        shouldCallInitData: false,
        description:
          'should not call dataInitFacade.initData if isLoggedIn and isDataLoaded are true',
      },
      {
        isLoggedIn: false,
        isDataLoaded: false,
        shouldCallInitData: false,
        description:
          'should not call dataInitFacade.initData if isLoggedIn and isDataLoaded are false',
      },
      {
        isLoggedIn: true,
        isDataLoaded: false,
        shouldCallInitData: true,
        description:
          'should call dataInitFacade.initData if isLoggedIn is true and isDataLoaded is false',
      },
    ].forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange
        authFacade.isLoggedIn = jasmine
          .createSpy('isLoggedIn')
          .and.returnValue(of(testCase.isLoggedIn));

        dataInitFacade.isDataLoaded = jasmine
          .createSpy('isDataLoaded')
          .and.returnValue(of(testCase.isDataLoaded));

        // Act
        const result = await firstValueFrom(guardUnderTest.canActivate());

        // Assert
        expect(result).toBeTrue();

        if (testCase.shouldCallInitData) {
          expect(dataInitFacade.initData).toHaveBeenCalledWith();
        } else {
          expect(dataInitFacade.initData).not.toHaveBeenCalled();
        }
      });
    });
  });
});
