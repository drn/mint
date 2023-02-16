import { createContext, Reducer, useReducer } from 'react';

import { MDXContentActionEnum } from '@/enums/MDXContentActionEnum';
import {
  ApiPlaygroundType,
  ContentWidthType,
  MDXContentState,
  ParamGroupsType,
  TableOfContentsType,
} from '@/types/mdxContentController';
import { OpenApiPlaygroundProps } from '@/ui/MDXContentController/getOpenApiPlaygroundProps';

const initialState: MDXContentState = {
  api: '',
  apiBaseIndex: 0,
  apiComponents: [],
  apiPlaygroundInputs: {},
  contentWidth: '',
  currentPath: '',
  currentTableOfContentsSection: undefined,
  generatedRequestExamples: undefined,
  isApi: false,
  isBlogMode: false,
  isWideSize: false,
  next: undefined,
  openApiPlaygroundProps: {},
  pageMetadata: {},
  paramGroupDict: {},
  paramGroups: [],
  prev: undefined,
  requestExample: undefined,
  responseExample: undefined,
  showApiPlayground: false,
  tableOfContents: [],
};

/**
 * Actions that can be dispatched in the MDXContentReducer.
 */
export type MDXContentAction =
  | { type: MDXContentActionEnum.SET_STATE; payload: Partial<MDXContentState> }
  | { type: MDXContentActionEnum.SET_API_BASE_INDEX; payload: number }
  | { type: MDXContentActionEnum.SET_IS_API; payload: boolean }
  | { type: MDXContentActionEnum.SET_IS_BLOG_MODE; payload: boolean }
  | { type: MDXContentActionEnum.SET_API_PLAYGROUND_INPUTS; payload: Record<string, unknown> }
  | { type: MDXContentActionEnum.SET_OPEN_API_PLAYGROUND_PROPS; payload: OpenApiPlaygroundProps }
  | {
      type: MDXContentActionEnum.SET_USER_DEFINED_EXAMPLES;
      payload: Pick<MDXContentState, 'requestExample' | 'responseExample'>;
    }
  | {
      type: MDXContentActionEnum.SET_TABLE_OF_CONTENTS;
      payload: TableOfContentsType;
    }
  | {
      type: MDXContentActionEnum.SET_CONTENT_WIDTH;
      payload: ContentWidthType;
    }
  | {
      type: MDXContentActionEnum.SET_PARAM_GROUPS;
      payload: ParamGroupsType;
    }
  | {
      type: MDXContentActionEnum.SET_API_PLAYGROUND;
      payload: ApiPlaygroundType;
    };

/**
 * Consolidates state and update logic of MDXContentController.
 * @param state - current state.
 * @param action - state action to dispatch.
 * @returns MDXContentState - new state.
 */
export const MDXContentReducer: Reducer<MDXContentState, MDXContentAction> = (
  state: MDXContentState,
  action
) => {
  const type = action.type;
  switch (type) {
    case MDXContentActionEnum.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case MDXContentActionEnum.SET_USER_DEFINED_EXAMPLES:
      const { requestExample, responseExample } = action.payload;
      return {
        ...state,
        requestExample,
        responseExample,
      };
    case MDXContentActionEnum.SET_TABLE_OF_CONTENTS:
      const { currentTableOfContentsSection, registerHeading, unregisterHeading, tableOfContents } =
        action.payload;
      return {
        ...state,
        currentTableOfContentsSection,
        registerHeading,
        unregisterHeading,
        tableOfContents,
      };
    case MDXContentActionEnum.SET_CONTENT_WIDTH:
      const { contentWidth, isWideSize } = action.payload;
      return {
        ...state,
        contentWidth,
        isWideSize,
      };
    case MDXContentActionEnum.SET_PARAM_GROUPS:
      const { paramGroups, paramGroupDict } = action.payload;
      return {
        ...state,
        paramGroups,
        paramGroupDict,
      };
    case MDXContentActionEnum.SET_API_PLAYGROUND:
      const { showApiPlayground, api, generatedRequestExamples } = action.payload;
      return {
        ...state,
        showApiPlayground,
        api,
        generatedRequestExamples,
      };
    case MDXContentActionEnum.SET_IS_API:
      return {
        ...state,
        isApi: action.payload,
      };
    case MDXContentActionEnum.SET_IS_BLOG_MODE:
      return {
        ...state,
        isBlogMode: action.payload,
      };
    case MDXContentActionEnum.SET_OPEN_API_PLAYGROUND_PROPS:
      return {
        ...state,
        openApiPlaygroundProps: action.payload,
      };
    case MDXContentActionEnum.SET_API_BASE_INDEX:
      return {
        ...state,
        apiBaseIndex: action.payload,
      };
    case MDXContentActionEnum.SET_API_PLAYGROUND_INPUTS:
      return {
        ...state,
        apiPlaygroundInputs: action.payload,
      };
  }
};

export const useMDXContentReducer = () => useReducer(MDXContentReducer, initialState);

export type MDXContentContextType = ReturnType<typeof useMDXContentReducer>;

export const MDXContentContext = createContext<MDXContentContextType>([initialState, () => null]);
