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
  const output = `[line ${pLine}] Error${pWhere || ''}: ${pMessage}`;
  if(require.main === module) {
    console.log(output);
  } else {
    throw new Error(output);
  }
}