import { TestBed } from '@angular/core/testing';
import { NumberSpacePipe } from './number-space.pipe';

describe('NumberSpacePipe', () => {
  let pipeUnderTest: NumberSpacePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NumberSpacePipe] });
  });

  beforeEach(() => {
    pipeUnderTest = TestBed.inject(NumberSpacePipe);
  });

  it('should be created', () => {
    expect(pipeUnderTest).toBeTruthy();
  });

  describe('#transform', () => {
    [
      {
        value: null,
        result: '',
      },
      {
        value: '1000',
        result: '1 000',
      },
      {
        value: '10000',
        result: '10 000',
      },
      {
        value: '100000',
        result: '100 000',
      },
      {
        value: '1000000',
        result: '1 000 000',
      },
      {
        value: 1000,
        result: '1 000',
      },
      {
        value: 10000,
        result: '10 000',
      },
      {
        value: 100000,
        result: '100 000',
      },
      {
        value: 1000000,
        result: '1 000 000',
      },
    ].forEach((testCase) => {
      it('should return transformed value', () => {
        // Arrange
        // Act
        const result = pipeUnderTest.transform(testCase.value);

        // Assert
        expect(result).toBe(testCase.result);
      });
    });
  });
});
