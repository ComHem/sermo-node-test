import {User} from '../types/user.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveUser(user: User): Promise<User> {
  return {...user};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUser(id: string): Promise<User | null> {
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteUser(id: string): Promise<string | null> {
  return null;
}
