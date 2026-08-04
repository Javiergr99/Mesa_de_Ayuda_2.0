const matrix = [
  "111111101101001111111",
  "100000100110101000001",
  "101110101010101011101",
  "101110100001001011101",
  "101110101111101011101",
  "100000101010101000001",
  "111111101010101111111",
  "000000001101100000000",
  "101101111000111101101",
  "010110001101000110010",
  "111011101011101011111",
  "001100001110001100100",
  "110111101001111011011",
  "000000001010100010000",
  "111111101100111010111",
  "100000101011000010100",
  "101110101110111111111",
  "101110100100001100010",
  "101110101111101011101",
  "100000100001001101000",
  "111111101101111011111",
];

export function QrCode({ size = 184 }: { size?: number }) {
  const cells = matrix.length;
  const cellSize = size / cells;
  return (
    <svg role="img" aria-label="Código QR de configuración de ejemplo" viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rounded-lg bg-white">
      <rect width={size} height={size} fill="white" />
      {matrix.flatMap((row, rowIndex) =>
        [...row].map((value, columnIndex) =>
          value === "1" ? (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              x={columnIndex * cellSize}
              y={rowIndex * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="var(--color-text-primary)"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
