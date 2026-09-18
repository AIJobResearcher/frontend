/**
 * @jest-environment node
 */
import { safeEmailHref, safeExternalUrl, safePhoneHref } from '@/shared/lib/url';

describe('safeExternalUrl', () => {
  it('accepts http and https links', () => {
    expect(safeExternalUrl('https://example.com/careers')).toBe('https://example.com/careers');
    expect(safeExternalUrl('http://example.com')).toBe('http://example.com/');
  });

  it('rejects javascript and data URLs', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(safeExternalUrl('data:text/html;base64,PHNjcmlwdD4=')).toBeNull();
  });

  it('rejects empty and malformed values', () => {
    expect(safeExternalUrl(undefined)).toBeNull();
    expect(safeExternalUrl('')).toBeNull();
    expect(safeExternalUrl('not a url')).toBeNull();
  });
});

describe('safeEmailHref', () => {
  it('accepts an email address', () => {
    expect(safeEmailHref('hr@example.com')).toBe('mailto:hr@example.com');
  });

  it('rejects values that are not email addresses', () => {
    expect(safeEmailHref('javascript:alert(1)')).toBeNull();
    expect(safeEmailHref('hr@example')).toBeNull();
  });
});

describe('safePhoneHref', () => {
  it('normalises a phone number', () => {
    expect(safePhoneHref('+38 (044) 123-45-67')).toBe('tel:+3804412345 67'.replace(' ', ''));
  });

  it('rejects values that are not phone numbers', () => {
    expect(safePhoneHref('javascript:alert(1)')).toBeNull();
    expect(safePhoneHref('123')).toBeNull();
  });
});
