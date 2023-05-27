[![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)](https://www.typescriptlang.org/)
[![vue](https://img.shields.io/badge/-Vue.js-4fc08d?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![fabric](https://img.shields.io/npm/v/fabric?label=fabric.js)](https://www.npmjs.com/package/fabric)

# Webster
---

Image editor with NFT markerplace. Edit your images, make them NFT and sell on our marketplace.

## About app
---
App have 2 main modules: image editor and marketplace.

ImageEditor contain:
<ul>
    <li>Text module</li>
    <li>Shapes module</li>
    <li>Drawing module</li>
    <li>Adding image layers</li>
    <li>History (undo/redo)</li>
    <li>Guidelines</li>
    <li>Rotating and scaling layers</li>
    <li>Copy/Pasting objects</li>
    <li>Simple layering (bring to front / send to back)</li>
    <li>Zoom and pan</li>
    <li>Hot keys</li>
    <li>Progress saving</li>
    <li>Download resulting image</li>
</ul>

Marketplace providing opportunity to tokenize your drawings, make them NFT and sell to another people.

<h3>Technology stack:</h3>
<ul>
	<li><b>Backend</b>: 	<i>NodeJS</i>, <i>Express</i>, <i>KNEX</i> </li>
	<li><b>Database</b>: 	<i>Postgresql</i> </li>
	<li><b>Smart contracts</b>: 	<i>Solidity</i> </li>
	<li><b>Frontend</b>: 	<i>Vue</i>, <i>TypeScript</i>, <i>SCSS</i>, <i>Fabric.js</i> </li>
	<li><b>Bundler</b>: 	<i>Vite</i> </li>
</ul>

<h3>Architecture:<h3>
<ul>
	<li><b>Server-API:</b> 	<i>REST and JSON-API specifications, MVC pattern</i> </li>
	<li><b>Database-API:</b> <i>builder pattern</i> </li>
	<li><b>Styles:</b> <i> BEM specification</i> </li>
	<li><b>Authentication:</b> <i> Web3 Auth</i> </li>
</ul>

<h3>Features:<h3>
<ul>	
	<li>Creating projects, project - its your own workspace for specific image editing session</li>
	<li>Editing images</li>
	<li>Selling images as NFT</li>
	<li>Fully mobile responsive</li>
	<li>Incredible loaders, slow down your network just to face this beauty</li>
</ul>

<h3>Third-party services:<h3>
<ul>
	<li>Metamask + ethers.js for handling cryptocurrency transactions</li>
	<li>INFURA API - for uploading banner and NFT metadata to IPFS</li>
</ul>
<hr>
<h2>Before start preparations</h2>

### 1. Database
---
    start postgresql server and create empty data base 

	# you can use docker compose file from the repo
	- docker compose up -d
    
### 2. Setup the environment
---
- Deploy <b>ImageNFT.sol</b> from the contracts folder. (You can use Remix or whatever IDE you like)
- Create ***.env*** file for backend and for frontend. Check ***.env.example*** in each folder.
	

### 3. Installing dependencies and preparing database
--- 
	cd server && yarn install && cd ../frontend && yarn install

### 4. Starting app
---
	# start in different terminals or in daemon mode
    # start from the dedicated folder (frontend || backend)

	yarn start 	# for frontend
	yarn dev 	# for backend
