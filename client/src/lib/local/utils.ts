import { promises as _promises } from 'fs';
import { pathExists } from 'fs-extra';

import { Snippet } from '@/types/snippet';

const { readdir, readFile } = _promises;

export const getFileList = async (dirName: string, og = dirName) => {
  let files: string[] = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      const path = `${dirName}/${item.name}`;
      const name = path.replace(og, '');
      files.push(name);
    }
  }

  return files;
};

export const getExtension = (path: string) => {
  return path.substring(path.lastIndexOf('.') + 1, path.length) || path;
};

export const removeExtension = (path: string) => {
  return path.substring(0, path.lastIndexOf('.'));
};

export const getPathsByExtension = (files: string[], ...extensions: string[]): string[] => {
  return files.filter((file) => {
    const extension = getExtension(file);
    return extensions.includes(extension);
  });
};

export const getPagePath = async (slug: string) => {
  const mdxPath = `src/_props/${slug}.mdx`;
  if (await pathExists(mdxPath)) {
    return mdxPath;
  }
  const mdPath = `src/_props/${slug}.mdx`;
  if (await pathExists(mdPath)) {
    return mdPath;
  }
  return null;
};

export const getFileContents = async (path: string) => {
  return (await readFile(path)).toString();
};

export const getFileContentsAsObject = async (path: string) => {
  return JSON.parse(await getFileContents(path));
};

export const getPrebuiltData = async (name: string) => {
  return getFileContentsAsObject(`src/_props/${name}.json`);
};

export const confirmFaviconsWereGenerated = async () => {
  // We could do more granular testing for this but there will
  // not be a case where only a few of these are generated.
  // It's all or nothing.
  return (
    (await pathExists('public/favicons/apple-touch-icon.png')) &&
    (await pathExists('public/favicons/favicon-32x32.png')) &&
    (await pathExists('public/favicons/favicon-16x16.png')) &&
    (await pathExists('public/favicons/favicon.ico'))
  );
};

function optionallyRemoveLeadingSlash(path: string) {
  if (!path || path.startsWith('/')) {
    return path.substring(1);
  }
  return path;
}

export const getSnippets = async (): Promise<Snippet[]> => {
  const snippetPath = 'src/_props/_snippets';
  const snippetFilenames = await getFileList(snippetPath);
  const snippetArr: Snippet[] = await Promise.all(
    snippetFilenames.map(async (filename) => {
      const content = await getFileContents(`${snippetPath}${filename}`);
      return {
        snippetFileLocation: optionallyRemoveLeadingSlash(filename),
        content,
      };
    })
  );
  return snippetArr;
};
