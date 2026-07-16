## Image Generation Integration

Use the preconfigured image generation helper that connects to the internal ImageService, no manual setup required.

Example usage:
```ts
import { generateImage } from "./server/_core/imageGeneration.ts";

const { url: imageUrl } = await generateImage({
  prompt: "A serene landscape with mountains"
});
// For editing:
const { url: imageUrl } = await generateImage({
  prompt: "Add a rainbow to this landscape",
  originalImages: [{
    url: "https://example.com/original.jpg",
    mimeType: "image/jpeg"
  }]
});
```

Tips
- Always call from server-side code (e.g., inside tRPC procedures) to avoid exposing API keys
- Image generation can take 5-20 seconds, implement proper loading states
- Implement proper error handling as image generation can fail
