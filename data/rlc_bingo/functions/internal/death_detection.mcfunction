tag @a[nbt={Health:0.0f}] add respawned

item replace entity @e[type=player,tag=respawned] armor.chest with minecraft:elytra{Unbreakable:1,Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]}
item replace entity @e[type=player,tag=respawned] inventory.0 with minecraft:firework_rocket{Fireworks:{Flight:2},Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 64
item replace entity @e[type=player,tag=respawned] armor.feet with minecraft:leather_boots{Enchantments:[{id:"minecraft:depth_strider", lvl: 3}, {id:"minecraft:vanishing_curse",lvl:1}], AttributeModifiers: [{Name:"generic.movement_speed",AttributeName:"generic.movement_speed",Operation:2,Amount:0.3,Slot:"feet",UUID:[I;1498693494,1027158888,1898994005,860320107]}], Unbreakable: true}
effect give @a[tag=respawned] night_vision infinite 0 true
tag @e[type=player,tag=respawned] remove respawned
