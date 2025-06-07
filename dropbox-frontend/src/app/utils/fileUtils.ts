export const formatSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  const kb = sizeInBytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export const prettyPrintJson = (jsonString: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
};
