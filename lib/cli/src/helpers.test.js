import fs from 'fs';
import fse from 'fs-extra';

import * as helpers from './helpers';
import { STORY_FORMAT } from './project_types';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  copySync: jest.fn(() => ({})),
}));

jest.mock('path', () => ({
  // make it return just the second path, for easier testing
  resolve: jest.fn((_, p) => p),
}));

jest.mock('./npm_init', () => ({
  npmInit: jest.fn(),
}));

describe('Helpers', () => {
  describe('copyTemplate', () => {
    it(`should fall back to ${STORY_FORMAT.CSF} 
        in case ${STORY_FORMAT.CSF_TYPESCRIPT} is not available`, () => {
      const csfDirectory = `template-${STORY_FORMAT.CSF}/`;
      fs.existsSync.mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', STORY_FORMAT.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should use ${STORY_FORMAT.CSF_TYPESCRIPT} if it is available`, () => {
      const csfDirectory = `template-${STORY_FORMAT.CSF_TYPESCRIPT}/`;
      fs.existsSync.mockImplementation((filePath) => {
        return filePath === csfDirectory;
      });
      helpers.copyTemplate('', STORY_FORMAT.CSF_TYPESCRIPT);

      const copySyncSpy = jest.spyOn(fse, 'copySync');
      expect(copySyncSpy).toHaveBeenCalledWith(csfDirectory, expect.anything(), expect.anything());
    });

    it(`should throw an error for unsupported story format`, () => {
      const storyFormat = 'non-existent-format';
      const expectedMessage = `Unsupported story format: ${storyFormat}`;
      expect(() => {
        helpers.copyTemplate('', storyFormat);
      }).toThrowError(expectedMessage);
    });
  });
});
