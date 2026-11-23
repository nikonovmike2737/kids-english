/* Stable lesson IDs; only the first three lessons are authored. The other nine are planned and locked. */
export const lessons = [
 {id:'ENG-001', title:'Feelings', icon:'😄', duration:'10–15 min', description:'Learn happy, sad, tired, angry and scared.', tasks:[
  {type:'choice',title:'Which word matches the picture?',figure:'😄',options:['sad','happy','angry','tired'],correct:1},
  {type:'choice',title:'I need a rest. How do I feel?',options:["I'm scared","I'm tired","I'm happy","I'm angry"],correct:1},
  {type:'match',title:'Match the feelings',pairs:[['happy','😄'],['sad','😢'],['angry','😠']]},
  {type:'order',title:'Make a sentence about a happy person 😄',tokens:['happy','am','I'],correct:['I','am','happy']}
 ]},
 {id:'ENG-002', title:'Move & Play', icon:'🏃', duration:'10–15 min', description:'Jump, run, swim and give silly commands!', tasks:[
  {type:'choice',title:'What do you do to leave the ground?',options:['Sleep','Jump','Read','Drink'],correct:1},
  {type:'choice',title:'Choose the picture for “Swim”',options:['🏃','😴','🏊','💃'],correct:2},
  {type:'match',title:'Match the actions',pairs:[['run','🏃'],['fly','🦅'],['sleep','😴']]},
  {type:'order',title:'Tell a friend to turn in a circle',tokens:['around','Spin'],correct:['Spin','around']}
 ]},
 {id:'ENG-003', title:'Animal Theatre', icon:'🎭', duration:'12–15 min', description:'Meet playful animals and act out their stories.', tasks:[
  {type:'choice',title:'Which animal is this?',figure:'🐸',options:['A cat','A frog','A bird','A dog'],correct:1},
  {type:'choice',title:'Is this a frog?',figure:'🐱',options:['Yes, it is.','No, it is not.','Yes, they are.','No, they are not.'],correct:1},
  {type:'match',title:'Match the animals',pairs:[['cat','🐱'],['dog','🐶'],['bird','🐦']]},
  {type:'order',title:'Make a sentence about this cat 🐱😢',tokens:['sad','is','The','cat'],correct:['The','cat','is','sad']}
 ]}
];
export const themeLabels=['Getting Started','Next Level','Final Challenge'];
export const stopToLesson={1:'ENG-001',2:'ENG-002',3:'ENG-003'};
// Anchors in the original 1672x941 scenery. Every row has four lesson nodes and one chest before the bridge.
export const stopPositions=[
 [1,30.0,29.9],[2,37.0,29.9],[3,44.0,29.9],[4,51.0,29.9],
 [5,64.5,53.4],[6,57.0,53.4],[7,49.5,53.4],[8,42.0,53.4],
 [9,35.0,77.0],[10,42.5,77.0],[11,50.0,77.0],[12,57.5,77.0]
];
// Chest coordinates are FOOT CONTACT points, not image centers.
export const chests=[
 {id:'chest-a',name:'First Chest',x:58.3,y:32.1,worldGroup:0,bonus:1},
 {id:'chest-b',name:'Second Chest',x:30.0,y:59.0,worldGroup:1,bonus:1},
 {id:'chest-c',name:'Third Chest',x:64.5,y:81.5,worldGroup:2,bonus:1},
 {id:'grand-chest',name:'Grand Treasure',x:88.5,y:69.5,worldGroup:3,bonus:5}
];
export const shopCatalog={
 hats:[['Captain Cap',1],['Explorer Hat',3],['Pirate Hat',5]],
 scarves:[['Cozy Scarf',1],['Adventure Scarf',3],['Royal Scarf',5]],
 shoes:[['Sneakers',1],['Explorer Boots',3],['Hero Boots',5]],
 backpacks:[['Travel Pack',1],['Explorer Pack',3],['Expedition Pack',5]],
 tools:[['Compass',1],['Binoculars',3],['Spyglass',5]]
};
export const worldCards=[
 {id:'adventure-island',name:'Adventure Island',image:'assets/maps/world-adventure.webp'},
 {id:'mystical-desert',name:'Mystical Desert',image:'assets/maps/world-desert.webp'},
 {id:'rainy-forest',name:'Rainy Forest',image:'assets/maps/world-forest.webp'}
];
