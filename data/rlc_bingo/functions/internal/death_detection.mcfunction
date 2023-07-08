tag @a[nbt={Health:0.0f}] add respawned

# 鞘翅
execute in bingolobby:lobby unless block 0 64 0 iron_block run item replace entity @e[type=player,tag=respawned] armor.chest with minecraft:elytra{Unbreakable:1,Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]}
# 烟花火箭
execute in bingolobby:lobby if block 0 64 0 diamond_block run item replace entity @e[type=player,tag=respawned] inventory.0 with minecraft:firework_rocket{Fireworks:{Flight:2},Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 64
# 速度靴子
execute in bingolobby:lobby if block 0 72 0 white_wool run item replace entity @e[type=player,tag=respawned] armor.feet with minecraft:leather_boots{Enchantments:[{id:"minecraft:depth_strider", lvl: 3}, {id:"minecraft:vanishing_curse",lvl:1}], AttributeModifiers: [{Name:"generic.movement_speed",AttributeName:"generic.movement_speed",Operation:2,Amount:0.3,Slot:"feet",UUID:[I;1498693494,1027158888,1898994005,860320107]}], Unbreakable: true}

# 清除
effect clear @a[tag=respawned]
# 夜视
execute in bingolobby:lobby if block 0 70 0 amethyst_block run effect give @a[tag=respawned] night_vision infinite 0 true

tag @e[type=player,tag=respawned] remove respawned
