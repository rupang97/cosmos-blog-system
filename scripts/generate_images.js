const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const imageModel = process.env.COSMOS_IMAGE_MODEL || 'gpt-image-2';
const imageQuality = process.env.COSMOS_IMAGE_QUALITY || 'high';
const allowedInfographicSizes = new Set([
  '1024x1024',
  '1024x768',
  '1024x576',
]);

function section(markdown, heading) {
  const expression = new RegExp(`^## ${heading}\\r?\\n([\\s\\S]*?)(?=^## |\\s*$)`, 'm');
  const match = markdown.match(expression);
  if (!match) throw new Error(`Missing "## ${heading}" section.`);
  return match[1].trim();
}

function optionalSection(markdown, heading) {
  try {
    return section(markdown, heading);
  } catch (error) {
    if (error.message === `Missing "## ${heading}" section.`) return null;
    throw error;
  }
}

function infographicSize(prompt) {
  const match = prompt.match(/Canvas size:\s*(\d+x\d+)/i);
  if (!match) return '1024x1024';
  if (!allowedInfographicSizes.has(match[1])) {
    throw new Error(`Unsupported infographic canvas size: ${match[1]}.`);
  }
  return match[1];
}

function validateTextRenderingInstructions(prompt, assetName) {
  const normalizedPrompt = prompt.toLowerCase();
  const mentionsTextFreeFallback = /without text|text-free|overlay copy|텍스트 없이|문구 없이/.test(
    normalizedPrompt,
  );
  const forbidsTextFreeFallback = /do not (?:create|use).*?(?:without text|text-free|overlay)|(?:텍스트|문구) 없이.*(?:금지|않)/.test(
    normalizedPrompt,
  );
  const requiresVerbatimText = /verbatim|그대로/.test(normalizedPrompt);
  const requiresInImageText = /inside the image|in the image|이미지 안/.test(
    normalizedPrompt,
  );

  if (mentionsTextFreeFallback && !forbidsTextFreeFallback) {
    throw new Error(`${assetName} prompt must not allow a text-free fallback.`);
  }

  if (!requiresVerbatimText || !requiresInImageText) {
    throw new Error(
      `${assetName} prompt must require exact text rendered inside the image.`,
    );
  }
}

async function generateImage({ prompt, size }) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: imageModel, prompt, size, quality: imageQuality }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || `Image API returned ${response.status}.`);
  const image = payload.data?.[0]?.b64_json;
  if (!image) throw new Error('Image API response did not include image data.');
  return Buffer.from(image, 'base64');
}

async function nextVersionedFilename(destination, assetName) {
  const filenames = await fs.readdir(destination);
  const expression = new RegExp(`^${assetName}-v(\\d+)\\.png$`);
  const versions = filenames
    .map((filename) => filename.match(expression))
    .filter(Boolean)
    .map((match) => Number(match[1]));
  const nextVersion = versions.length ? Math.max(...versions) + 1 : 1;
  return `${assetName}-v${nextVersion}.png`;
}

async function loadImageManifest(manifestPath) {
  try {
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    return {
      ...manifest,
      assets: Array.isArray(manifest.assets) ? manifest.assets : [],
    };
  } catch (error) {
    if (error.code === 'ENOENT') return { assets: [] };
    throw new Error(`Could not read image manifest: ${error.message}`);
  }
}

async function main() {
  const articleFile = process.argv[2];
  if (!articleFile) throw new Error('Usage: node scripts/generate_images.js <article-markdown-file>');
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required. Store it outside Git, for example in your PowerShell session.');

  const absoluteArticlePath = path.resolve(projectRoot, articleFile);
  const markdown = await fs.readFile(absoluteArticlePath, 'utf8');
  const baseName = path.basename(articleFile, path.extname(articleFile));
  const destination = path.join(projectRoot, 'images', baseName);
  const infographicOneWithNumber = optionalSection(markdown, '인포그래픽 1 프롬프트');
  const infographicOne = infographicOneWithNumber
    ?? section(markdown, '인포그래픽 프롬프트');
  const infographicTwo = optionalSection(markdown, '인포그래픽 2 프롬프트');
  const jobs = [
    {
      name: 'thumbnail',
      heading: '썸네일 프롬프트',
      prompt: section(markdown, '썸네일 프롬프트'),
      size: '1024x1024',
    },
    {
      name: 'infographic-01',
      heading: infographicOneWithNumber ? '인포그래픽 1 프롬프트' : '인포그래픽 프롬프트',
      prompt: infographicOne,
      size: infographicSize(infographicOne),
    },
    ...(infographicTwo ? [{
      name: 'infographic-02',
      heading: '인포그래픽 2 프롬프트',
      prompt: infographicTwo,
      size: infographicSize(infographicTwo),
    }] : []),
  ];

  for (const job of jobs) {
    validateTextRenderingInstructions(job.prompt, job.name);
  }

  await fs.mkdir(destination, { recursive: true });
  const manifestPath = path.join(destination, 'manifest.json');
  const manifest = await loadImageManifest(manifestPath);
  const assets = [];
  for (const job of jobs) {
    const bytes = await generateImage(job);
    const filename = await nextVersionedFilename(destination, job.name);
    await fs.writeFile(path.join(destination, filename), bytes);
    assets.push({
      filename,
      prompt: job.prompt,
      promptSource: `${articleFile}#${job.heading}`,
      canvasSize: job.size,
      status: 'pending_review',
      textValidation: 'manual_required',
    });
    console.log(`Created images/${baseName}/${filename}`);
  }
  await fs.writeFile(manifestPath, `${JSON.stringify({
    ...manifest,
    articleFile,
    generationMethod: 'OpenAI Images API',
    model: imageModel,
    quality: imageQuality,
    updatedAt: new Date().toISOString(),
    assets: [...manifest.assets, ...assets],
  }, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
