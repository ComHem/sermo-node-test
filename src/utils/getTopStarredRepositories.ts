import {log} from './log.js';
import fetch from 'node-fetch';

export interface Repo {
  full_name: string;
  stargazers_count: number;
}

export async function getTopStarredRepositories(
  username: string,
): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos: Repo[] = await res.json();

    return repos
      .filter((repo) => repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map((repo) => repo.full_name);
  } catch (error) {
    log(error);
    // Default to an empty list so the application doesn't break when repos
    // aren't available and can continue to serve other content.
    return [];
  }
}
