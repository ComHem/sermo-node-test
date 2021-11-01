import isemail from 'isemail';

export function validateEmail(
  email: string,
  required = true,
): Error | undefined {
  if (!email) return required ? new Error('Required') : undefined;
  if (!isemail.validate(email, {minDomainAtoms: 2}))
    return new Error('Invalid email');
}
