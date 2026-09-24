import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMailto, buildGmailCompose } from '../src/lib/contact.js';
import { portfolio } from '../src/data/portfolio.js';
test('email app and Gmail drafts keep the owner recipient and visitor message',()=>{
 const values={name:'Visitor & team',email:'visitor@example.com',message:'Hello Kasim!\nA project about C++ & AI? #details'};
 const email=new URL(buildMailto(portfolio.links.email,values));
 const gmail=new URL(buildGmailCompose(portfolio.links.email,values));
 assert.equal(decodeURIComponent(email.pathname),'dkasim.ise.rymec@gmail.com');
 assert.equal(gmail.origin,'https://mail.google.com');
 assert.equal(gmail.searchParams.get('to'),'dkasim.ise.rymec@gmail.com');
 assert.equal(gmail.searchParams.get('su'),email.searchParams.get('subject'));
 assert.equal(gmail.searchParams.get('body'),email.searchParams.get('body'));
 assert.ok(gmail.searchParams.get('body').includes(values.email));
 assert.ok(gmail.searchParams.get('body').includes(values.message));
});
