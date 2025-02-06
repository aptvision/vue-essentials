import { useDateHelpers } from '../../src/core/DateHelpers';
import { vi, describe, it, expect } from 'vitest';
import { IDateHelpersConfig } from '../../src/interface/DateHelpersInterface';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns'
import { date } from 'quasar'


describe('Testing useDateHelpers', () => {
  it('call to function with params', () => {
    
    const config:IDateHelpersConfig = {
        localeCode:'en',
        $_t:()=>{}
        
    }
    const result = useDateHelpers(config);
    expect(result).toBeTruthy()

  });
  it('call to function without params', () => {
    
    const config = undefined
    const result = useDateHelpers(config);
    expect(result).toBeTruthy()

  });

  it('call to currentDateSql()', () => {
    
    const mockDate = new Date('2024-01-01T00:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    const {currentDateSql} = useDateHelpers()
    const result = currentDateSql();
    expect(result).toBe('2024-01-01')

    vi.useRealTimers();

  });

  it('call to currentYear()', () => {
    
    const mockDate = new Date('2024-01-01T00:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    const mockYear = format(mockDate, 'yyyy')
    const {currentYear} = useDateHelpers()
    const result = currentYear();
    expect(result).toBe('2024')

    vi.useRealTimers();

  });

  it('call to time()', () => {
    
    const mockDate = new Date('2024-01-01T10:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    
    const {time} = useDateHelpers()
    const result = time(mockDate.toISOString());
    expect(result).toBe('10:00')

    vi.useRealTimers();

  });
});