import { useState } from "react";

let idCnt = 0;

export function generateId(prefix = "brewing-id") {
  idCnt = idCnt + 1;
  return `${prefix}-${idCnt}`;
}

export default function useId(prefix?: string) {
  const [id] = useState(() => generateId(prefix));
  return id;
}
