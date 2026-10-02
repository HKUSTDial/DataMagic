import Ajv2020 from 'ajv/dist/2020.js';
import {cardById,validateProject} from './model.mjs';
const ajv=new Ajv2020({strict:false,allErrors:true,validateFormats:false});
const validators=new Map();
export function validateProps(id,props){const card=cardById[id];if(!card?.native)return;let check=validators.get(id);if(!check){check=ajv.compile(card.schema);validators.set(id,check);}if(!check(props))throw new Error(`${card.name.zh}: ${ajv.errorsText(check.errors,{separator:'; '})}`);}
export function validateAll(project){validateProject(project);for(const track of project.tracks)for(const clip of track.clips)validateProps(clip.cardId,clip.props);return project;}
