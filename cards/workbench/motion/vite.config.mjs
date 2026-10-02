import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApi} from './server/api.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({root:here,publicDir:path.resolve(here,'../../public'),plugins:[react(),{name:'datamagic-workbench-api',configureServer(server){createApi(server);}}],server:{host:'127.0.0.1',port:5190,strictPort:true,fs:{allow:[path.resolve(here,'../..')]}},build:{outDir:'dist'},resolve:{dedupe:['react','react-dom','remotion','@remotion/player']}});
