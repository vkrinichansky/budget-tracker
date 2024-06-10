import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostConnectionMessageComponent } from './lost-connection-message.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('LostConnectionMessageComponent', () => {
  let componentUnderTest: LostConnectionMessageComponent;
  let fixture: ComponentFixture<LostConnectionMessageComponent>;

  let mockWindow: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LostConnectionMessageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{provide: Window, useValue: {location: {reload: () => {}}}}],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LostConnectionMessageComponent);
    componentUnderTest = fixture.componentInstance;
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should return the correct translation key', () => {
      // Arrange 
      const parentKey = 'lostConnectionMessage';
      const key = 'key';
      const expectedResult = `${parentKey}.${key}`;

      // Act
      const result = componentUnderTest.buildTranslationKey(key);
      
      // Assert
      expect(result).toBe(expectedResult);
    });
  });
});
