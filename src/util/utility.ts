/*=========================================================
    Imports
=========================================================*/

/*=========================================================
    Functions
=========================================================*/

export function error(pLine: number, pMessage: string): void {
  report(pLine, undefined, pMessage);
}

export function report(pLine: number, pWhere: string | undefined, pMessage: string) {
  console.log(
    `[line ${pLine}] Error${pWhere || ''}: ${pMessage}`
  );
}