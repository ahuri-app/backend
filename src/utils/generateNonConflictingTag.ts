import db from './db';

function generateTag(): string {
  const characters = 'qwertyuiopasdfghjklzxcvbnm';
  let result = '';
  for (let i = 0; i < 4; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
}

async function generateNonConflictingTag(username: string): Promise<string> {
  const generatedTag = generateTag();
  try {
    await db.user.findFirstOrThrow({
      where: {
        username,
        tag: generatedTag,
      },
    });
    return generateNonConflictingTag(username);
  } catch {
    return generatedTag;
  }
}

export default generateNonConflictingTag;
