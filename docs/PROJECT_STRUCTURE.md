# COSMOS Project Structure

COSMOS (Content Operating System for Multi-channel Optimized Strategy) keeps strategy, reusable inputs, content, and generated deliverables clearly separated.

```text
COSMOS/
├── docs/                  Project documentation and architecture
├── config/                Configuration for workflows and channels
├── prompts/               Reusable AI prompt assets
│   ├── article/           Long-form content prompts
│   ├── thumbnail/         Thumbnail-generation prompts
│   ├── infographic/       Infographic-generation prompts
│   ├── seo/               Search-optimization prompts
│   └── tags/              Tag and taxonomy prompts
├── templates/             Reusable content and output templates
├── scripts/               Automation and utility scripts
├── content/               Source content organized by editorial domain
│   ├── living-info/       Practical living-information content
│   ├── living-economy/    Household and everyday economy content
│   └── ai-literacy/       AI education and literacy content
├── output/                Generated, publish-ready deliverables
├── assets/                Shared media and brand assets
└── logs/                  Workflow and automation logs
```

Keep source material in `content`, reusable instructions in `prompts`, and generated artifacts in `output`. This separation lets channels and automation grow independently without mixing inputs with results.
