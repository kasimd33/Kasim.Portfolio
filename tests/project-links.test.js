import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getProjectSource } from '../src/lib/project-links.js';
test('project source prefers a repository and otherwise uses the profile',()=>{
 assert.deepEqual(getProjectSource({github:'https://github.com/example/project'},'https://github.com/example'),{href:'https://github.com/example/project',label:'View repository',kind:'repository'});
 assert.deepEqual(getProjectSource({github:'  '},'https://github.com/example'),{href:'https://github.com/example',label:'GitHub profile',kind:'profile'});
 assert.deepEqual(getProjectSource({}),{href:'https://github.com/',label:'GitHub',kind:'github'});
});
