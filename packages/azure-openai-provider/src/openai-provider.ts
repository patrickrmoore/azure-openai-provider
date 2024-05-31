import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { OpenAIChatLanguageModel } from './openai-chat-language-model';
import { OpenAIChatModelId, OpenAIChatSettings } from './openai-chat-settings';
import { OpenAICompletionLanguageModel } from './openai-completion-language-model';
import {
  OpenAICompletionModelId,
  OpenAICompletionSettings,
} from './openai-completion-settings';
import { OpenAIEmbeddingModel } from './openai-embedding-model';
import {
  OpenAIEmbeddingModelId,
  OpenAIEmbeddingSettings,
} from './openai-embedding-settings';

export interface OpenAIProvider {
  (
    modelId: OpenAIChatModelId,
    deploymentName: string,
    settings?: OpenAIChatSettings,
  ): OpenAIChatLanguageModel;

  /**
Creates an OpenAI chat model for text generation.
   */
  chat(
    modelId: OpenAIChatModelId,
    settings?: OpenAIChatSettings,
  ): OpenAIChatLanguageModel;

  /**
Creates an OpenAI completion model for text generation.
   */
  completion(
    modelId: OpenAICompletionModelId,
    settings?: OpenAICompletionSettings,
  ): OpenAICompletionLanguageModel;

  /**
Creates a model for text embeddings.
   */
  embedding(
    modelId: OpenAIEmbeddingModelId,
    settings?: OpenAIEmbeddingSettings,
  ): OpenAIEmbeddingModel;
}

export interface OpenAIProviderSettings {
  /**
Optional base URL for custom DNS or proxies
     */
  baseURL?: string;

  /**
   The Azure API Version to use [see here](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)
   */
  apiVersion: string;

  /**
API key for authenticating requests. Can also be passed via the `AZURE_OPENAI_API_KEY` environment variable.
     */
  apiKey?: string;

  /**
   The name of the Azure OpenAI resource
   */
  resourceName?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
OpenAI compatibility mode. Should be set to `strict` when using the OpenAI API,
and `compatible` when using 3rd party providers. In `compatible` mode, newer
information such as streamOptions are not being sent. Defaults to 'compatible'.
   */
  compatibility?: 'strict' | 'compatible';
}

/**
Create an OpenAI provider instance.
 */
export function createAzureOpenAI(
  options: OpenAIProviderSettings,
): OpenAIProvider {
  const baseURL = withoutTrailingSlash(options.baseURL);

  // we default to compatible, because strict breaks providers like Groq:
  const compatibility = options.compatibility ?? 'compatible';
  const getHeaders = () => ({
    'api-key': loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'AZURE_OPENAI_API_KEY',
      description: 'Azure OpenAI',
    }),
    ...options.headers,
  });

  const createChatModel = (
    modelId: OpenAIChatModelId,
    deploymentName: string,
    settings: OpenAIChatSettings = {},
  ) =>
    new OpenAIChatLanguageModel(modelId, deploymentName, settings, {
      provider: 'openai.chat',
      apiVersion: options.apiVersion,
      resourceName: options.resourceName,
      baseURL: baseURL,
      headers: getHeaders,
      compatibility,
    });

  // const createCompletionModel = (
  //   modelId: OpenAICompletionModelId,
  //   settings: OpenAICompletionSettings = {},
  // ) =>
  //   new OpenAICompletionLanguageModel(modelId, settings, {
  //     provider: 'openai.completion',
  //     baseURL,
  //     headers: getHeaders,
  //     compatibility,
  //   });

  // const createEmbeddingModel = (
  //   modelId: OpenAIEmbeddingModelId,
  //   settings: OpenAIEmbeddingSettings = {},
  // ) =>
  //   new OpenAIEmbeddingModel(modelId, settings, {
  //     provider: 'openai.embedding',
  //     baseURL,
  //     headers: getHeaders,
  //   });

  const provider = function (
    modelId: OpenAIChatModelId, // | OpenAICompletionModelId,
    deploymentName: string,
    settings?: OpenAIChatSettings, // | OpenAICompletionSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The OpenAI model function cannot be called with the new keyword.',
      );
    }

    // if (modelId === 'gpt-3.5-turbo-instruct') {
    //   return createCompletionModel(
    //     modelId,
    //     settings as OpenAICompletionSettings,
    //   );
    // }

    return createChatModel(modelId, deploymentName, settings);
  };

  provider.chat = createChatModel;
  // provider.completion = createCompletionModel;
  // provider.embedding = createEmbeddingModel;

  return provider as OpenAIProvider;
}
