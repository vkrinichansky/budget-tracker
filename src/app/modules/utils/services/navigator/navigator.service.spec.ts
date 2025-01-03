import { TestBed } from '@angular/core/testing';
import { NavigatorService } from './navigator.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../models';

describe('NavigatorService', () => {
  let serviceUnderTest: NavigatorService;

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigatorService, { provide: Router, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(NavigatorService);

    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy('navigate');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#navigateToAuthPage', () => {
    it(`should call router.navigate with ${AppRoutes.Auth}`, () => {
      // Arrange
      // Act
      serviceUnderTest.navigateToAuthPage();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Auth]);
    });
  });

  describe('#navigateToDashboard', () => {
    it(`should call router.navigate with ${AppRoutes.Dashboard}`, () => {
      // Arrange
      // Act
      serviceUnderTest.navigateToDashboard();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Dashboard]);
    });
  });
});
