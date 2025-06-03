/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {initializeUnitTest} from 'lexical/src/__tests__/utils';

describe('Example Test', () => {
  it('should pass a simple assertion', () => {
    expect(1 + 1).toBe(2);
  });

  // This test demonstrates how to use the Lexical editor in tests
  initializeUnitTest((testEnv) => {
    it('should initialize a Lexical editor', async () => {
      expect(testEnv.editor).toBeDefined();
      expect(testEnv.container).toBeDefined();
    });
  });
});
