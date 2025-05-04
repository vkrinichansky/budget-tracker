import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DataInitFacadeService } from '@budget-tracker/data';
import { AuthFacadeService } from '@budget-tracker/auth';
import { of } from 'rxjs';
import { NgVarDirective } from '@budget-tracker/utils';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let componentUnderTest: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let dataInitFacade: DataInitFacadeService;
  let authFacade: AuthFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, NgVarDirective],
      imports: [RouterModule],
      providers: [
        { provide: DataInitFacadeService, useValue: {} },
        { provide: AuthFacadeService, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    componentUnderTest = fixture.componentInstance;

    dataInitFacade = TestBed.inject(DataInitFacadeService);
    dataInitFacade.isDataLoaded = jasmine.createSpy('isDataLoaded').and.returnValue(of(true));

    authFacade = TestBed.inject(AuthFacadeService);
    authFacade.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(of(true));
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should call appropriate methods', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(dataInitFacade.isDataLoaded).toHaveBeenCalledWith();
      expect(authFacade.isLoggedIn).toHaveBeenCalledWith();
    });
  });
});
