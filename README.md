# azure-openai-provider

Vercel AI Provider for running Large Language Models using Azure OpenAI

> **Note: This module is under development and may contain errors and frequent incompatible changes.**
>
> All releases will be of type MAJOR following the 0.MAJOR.MINOR scheme. Only bugs and model updates will be released as MINOR.
> Please read the [Tested models and capabilities](#tested-models-and-capabilities) section to know about the features
> implemented in this provider.

## Installation

The Azure OpenAI provider is available in the `azure-openai-provider` module. You can install it with

```bash
npm i ollama-ai-provider
```

## Provider Instance

Unlike other providers, there is no default instance and you must create your own instance:

```ts
import { createAzureOpenAI } from "azure-openai-provider";

const azureOpenAI = createAzureOpenAI({
  baseURL: "https://yourinstancename.azure.openai.com",
});
```

Required settings:
baseURL

You can use the following optional settings to customize the Ollama provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `http://localhost:11434/api`.

- **headers** _Record<string,string>_

  Custom headers to include in the requests.

## About

This package is a slightly modified version of the official OpenAI provider by Vercel. It has been tested against chat

Summary of current changes:

## Models

The first argument is your deployment name, e.g. `gpt-4-turbo-deployment`.

```ts
const model = azureOpenAI("gpt-4-turbo-deployment");
```

## Examples

Inside the `examples` folder, you will find some example projects to see how the provider works. Each folder
has its own README with the usage description.

## Tested models and capabilities

This provider is capable of generating and streaming text and objects. Object generation may fail depending
on the model used and the schema used.

At least it has been tested with the following features:

| Image input        | Object generation  | Tool usage | Tool streaming |
| ------------------ | ------------------ | ---------- | -------------- |
| :white_check_mark: | :white_check_mark: | :warning:  | :warning:      |

### Image input

> This feature is currently broken. Feel free to open a PR to add this capability, but be aware of this: azure link explaining how tool calling doesn't work with image inputs

### Object generation

> This feature is unstable with some models

Some models are better than others. Also, there is a bug in Ollama that sometimes causes the JSON generation to be slow or
end with an error. In my tests, I detected this behavior with llama3 and phi3 models more than others like
`openhermes` and `mistral`, but you can experiment with them too.

More info about the bugs:

- https://github.com/ollama/ollama/issues/3851
- https://github.com/ollama/ollama/pull/3785

Remember that Ollama and this module are free software, so be patient.

### Tool usage (no streaming)

> This feature is not completed and unstable

Ollama does not support tooling, so this provider simulates tool usage with prompt injection. That means that
this feature can fail very often. Again, it depends on the model you use, and it is very related to the object
generation issues explained in the previous section.

I recommend you use `openhermes` and `mistral` or experiment with your preferred models.

### Tool streaming

> This feature is not completed and unstable

Again, since Ollama does not support tooling, we should simulate the feature. In this case, the problem is worse than
in non-streaming tool usage. We don't have the full response before knowing if the model has detected function calling.
We are waiting for the first characters before sending the deltas to detect if we are in a tool call flow.

Obviously, this is very buggy and should be used with caution. Right now, you cannot use it in chats and with more than
one tool.
