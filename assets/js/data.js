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
export const stopPositions=[
 [1,35,29.8],[2,43,29.8],[3,51,29.8],[4,59,29.8],
 [5,66,53.4],[6,58,53.4],[7,50,53.4],[8,42,53.4],
 [9,34,76.9],[10,42,76.9],[11,50,76.9],[12,58,76.9]
];
export const chests=[
 {id:'chest-a',name:'First Chest',x:65.6,y:27.1,worldGroup:0,bonus:1},
 {id:'chest-b',name:'Second Chest',x:30.6,y:53.5,worldGroup:1,bonus:1},
 {id:'chest-c',name:'Third Chest',x:68.0,y:76.6,worldGroup:2,bonus:1},
 {id:'grand-chest',name:'Grand Treasure',x:88.2,y:66.8,worldGroup:3,bonus:5}
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
