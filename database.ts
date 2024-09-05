import PocketBase from "pocketbase";

export async function createDatabase(databaseUrl: string): Promise<PocketBase> {
  const pb = new PocketBase(databaseUrl);

  await pb.admins.authWithPassword("gaston@localhost.local", "pocketbase");

  return pb;
}
