export const prerender = false;

export async function POST({ request }) {
  try {
    const { prompt } = await request.json();

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-2",        // ✅ DALL·E 2 instead of 3
        prompt,
        n: 1,
        size: "256x256",          // Good balance of cost and speed
        response_format: "url"    // ✅ Required to get a usable image link
      })
    });

    const data = await response.json();

    if (!data.data || !data.data[0]?.url) {
      console.error("OpenAI returned unexpected response:", data);
      return new Response(JSON.stringify({ error: "No image returned" }), { status: 500 });
    }

    return new Response(JSON.stringify({ imageUrl: data.data[0].url }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("DALL·E error:", err);
    return new Response(JSON.stringify({ error: "Image generation failed" }), {
      status: 500
    });
  }
}
