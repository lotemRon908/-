// AI Orchestration for GameCraft MVP
// Requires: OpenAI + Stability API keys in .env or config

interface GameData {
  title: string;
  hero: string;
  map: string[];
  sprite: string | null;
}

interface GameLogicResponse {
  title?: string;
  hero?: string;
  map?: string[];
}

export async function generateGame(prompt: string): Promise<GameData> {
  console.log("Generating game with prompt:", prompt);

  // Step 1: Use OpenAI to create game logic
  const gameLogic = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a game engine generator. Output JSON game objects only." },
        { role: "user", content: `Build a simple game: ${prompt}` }
      ],
      temperature: 0.7
    })
  }).then(res => res.json());

  let parsedLogic: GameLogicResponse;
  try {
    parsedLogic = JSON.parse(gameLogic.choices[0].message.content);
  } catch (err) {
    parsedLogic = { title: "Generated Game", map: ["####", "# R#", "####"] };
  }

  // Step 2: Generate placeholder sprite via Stability API
  const spriteUrl = await generateSprite(prompt);

  return {
    title: parsedLogic.title || "Untitled Game",
    hero: parsedLogic.hero || "🤖",
    map: parsedLogic.map || [],
    sprite: spriteUrl
  };
}

export async function generateSprite(description: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_STABILITY_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: description,
        output_format: "png",
        width: 64,
        height: 64
      })
    });

    if (!response.ok) {
      console.error("Sprite generation failed.");
      return null;
    }

    const data = await response.json();
    return data.image_url || null;
  } catch (error) {
    console.error("Error generating sprite:", error);
    return null;
  }
}