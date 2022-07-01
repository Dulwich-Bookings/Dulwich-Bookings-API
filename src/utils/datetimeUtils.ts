import userFriendlyMessages from '../consts/userFriendlyMessages';

export function validateUTCString(utc: string): void {
  // Regex expression to check if string is in ISO 8601 UTC format (eg. 2020-01-01T00:00:00Z)
  const isUTCString = new RegExp(
    '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z'
  );
  if (!isUTCString.test(utc)) {
    throw new Error(userFriendlyMessages.failure.invalidUTCString);
  }
}
