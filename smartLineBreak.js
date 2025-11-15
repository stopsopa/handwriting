export default function smartLineBreak(text, limit) {
  const lines = text
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);
  const result = [];
  lines.forEach((line) => {
    if (line.length <= limit) {
      result.push(line);
    } else {
      let currentLine = "";
      const words = line.split(" ");
      words.forEach((word) => {
        if (currentLine.length + word.length + 1 <= limit) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          result.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) {
        result.push(currentLine);
      }
    }
  });
  return result;
}
