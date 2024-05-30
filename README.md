# azure-openai-provider

Vercel AI Provider for running Large Language Models using Azure OpenAI

> **Note: This module is under development and may contain errors and frequent incompatible changes.**
>
> All releases will be of type MAJOR following the 0.MAJOR.MINOR scheme. Only bugs and non-breaking updates will be released as MINOR.
> Please read the [Tested models and capabilities](#tested-models-and-capabilities) section to know about the features
> implemented in this provider.

## Installation

The Azure OpenAI provider is available in the `azure-openai-provider` module. You can install it with

```bash
npm i azure-openai-provider
yarn add azure-openai-provider
```

## Provider Instance

Unlike other providers, there is no default instance and you must create your own instance:

```ts
import { createAzureOpenAI } from 'azure-openai-provider';

const azureOpenAI = createAzureOpenAI({
  resourceName: 'YourAzureOpenAIResourceName',
  // or baseURL if using a proxy. baseURL: https://apigateway.acme.com
});

await streamText({
  model: azureOpenAi('modelId', 'yourDeploymentName'),
  ...
})

```

You can use the following optional settings to customize the Azure OpenAI provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  If baseURL is passed it will override the `resourceName` property.
  Note: `/openai/deployments/${this.deploymentName}` will still be appended to the end of the baseURL
  ex. `baseURL: "https://apigateway.acme.com"`

- **headers** _Record<string,string>_

  Custom headers to include in the requests.

## About

This package is a slightly modified version of the official OpenAI provider by Vercel.

Summary of current changes:
Added apiVersion and resourceName to the provider options
Mapped apiKey to the `api-key` header, instead of the 'Authorization' header
Change `convert-to-openai-chat-message.ts` to map user messages as {role: "user", content: string} instead of the new format. This will likely break vision capable models

## Models

The first argument is your deployment name, e.g. `gpt-4-turbo-deployment`.

```ts
const model = azureOpenAI('gpt-4-turbo-deployment');
```

## Examples

Inside the `examples` folder, you will find some example projects to see how the provider works. Each folder
has its own README with the usage description.

## Tested capabilities

### AI SDK Core

✅ - confirmed working
❌ - does not work

| Method         | Status                     |
| -------------- | -------------------------- |
| generateText   | ✅                         |
| streamText     | ✅                         |
| generateObject | ✅                         |
| streamObject   | untested (assumed working) |

### AI SDK UI

| Method        | Status                         |
| ------------- | ------------------------------ |
| useChat       | ✅                             |
| useCompletion | ❌                             |
| useAssistant  | untested (assumed not working) |

### AI SDK RSC

| Method             | Status |
| ------------------ | ------ |
| createStreamableUI | ✅     |
