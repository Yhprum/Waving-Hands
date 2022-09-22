import { error, json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let body = await request.json();

  return json({
    body,
  });
}
