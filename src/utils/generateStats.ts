interface GenerateStatsParams {
  content: string;
  fileCount: number;
}

export function generateStats({ content, fileCount }: GenerateStatsParams) {
  const totalChars = content.length;
  const totalTokens = Math.ceil(totalChars / 4);

  return {
    chars: totalChars.toLocaleString(),
    tokens: totalTokens.toLocaleString(),
    fileCount,
  };
}
