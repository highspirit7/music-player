function toMinutesAndSeconds(seconds: number): string {
  if (seconds < 0) {
    throw new Error('Seconds cannot be negative');
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // 두 자리 숫자를 유지하도록 초는 2자리로 표현 (예: 3:05)
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

export default toMinutesAndSeconds;
