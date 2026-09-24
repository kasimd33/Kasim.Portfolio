import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, buildMailto } from '../src/lib/contact.js';
import { portfolio } from '../src/data/portfolio.js';
import { existsSync } from 'node:fs';
test('contact form rejects empty, whitespace-only, and malformed input',()=>{
 assert.equal(Object.keys(validateContact({name:' ',email:'bad@',message:' '})).length,3);
 assert.deepEqual(validateContact({name:'Recruiter',email:'hello@example.com',message:'Let us discuss a software engineering role.'}),{});
});
test('email draft safely encodes user content and preserves the message',()=>{
 const url=buildMailto('owner@example.com',{name:'A & B',email:'a@example.com',message:'Hello?\nC++ & Java #1'});
 const query=new URLSearchParams(url.split('?')[1]);
 assert.equal(query.get('subject'),'Portfolio enquiry from A & B');
 assert.ok(query.get('body').includes('Hello?\nC++ & Java #1'));
});
test('published local project assets exist and resume only enables with its file',()=>{
 for(const project of portfolio.projects) assert.ok(existsSync(`public${project.image}`),project.id);
 if(portfolio.resumeAvailable) assert.ok(existsSync(`public${portfolio.links.resume}`));
 for(const item of [...portfolio.experience,...portfolio.certifications]) assert.equal(typeof item.verified,'boolean');
});
