const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const imageModel = process.env.COSMOS_IMAGE_MODEL || 'gpt-image-2';

function section(markdown, heading) {
  const expression = new RegExp(`^## ${heading}\\r?\\n([\\s\\S]*?)(?=^## |\\s*$)`, 'm');
  const match = markdown.match(expression);
  if (!match) throw new Error(`Missing "## ${heading}" section.`);
  return match[1].trim();
}

async function generateImage({ prompt, size }) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: imageModel, prompt, size, quality: 'low' }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || `Image API returned ${response.status}.`);
  const image = payload.data?.[0]?.b64_json;
  if (!image) throw new Error('Image API response did not include image data.');
  return Buffer.from(image, 'base64');
}

async function main() {
  const articleFile = process.argv[2];
  if (!articleFile) throw new Error('Usage: node scripts/generate_images.js <article-markdown-file>');
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required. Store it outside Git, for example in your PowerShell session.');

  const absoluteArticlePath = path.resolve(projectRoot, articleFile);
  const markdown = await fs.readFile(absoluteArticlePath, 'utf8');
  const baseName = path.basename(articleFile, path.extname(articleFile));
  const destination = path.join(projectRoot, 'images', baseName);
  const jobs = [
    { name: 'thumbnail', prompt: section(markdown, '썸네일 프롬프트'), size: '1024x1024' },
    { name: 'infographic-01', prompt: section(markdown, '인포그래픽 프롬프트'), size: '1024x1536' },
  ];

  await fs.mkdir(destination, { recursive: true });
  const assets = [];
  for (const job of jobs) {
    const bytes = await generateImage(job);
    const filename = `${job.name}.png`;
    await fs.writeFile(path.join(destination, filename), bytes);
    assets.push({ filename, prompt: job.prompt, size: job.size, status: 'pending_review' });
    console.log(`Created images/${baseName}/${filename}`);
  }
  await fs.writeFile(path.join(destination, 'manifest.json'), `${JSON.stringify({ articleFile, model: imageModel, quality: 'low', createdAt: new Date().toISOString(), assets }, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
