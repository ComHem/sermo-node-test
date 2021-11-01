// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function validateRequired(value: any): Error | undefined {
  if (!value) return new Error('Required');
}
