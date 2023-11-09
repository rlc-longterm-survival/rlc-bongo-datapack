execute in bingolobby:lobby if block 0 68 0 air run tag @a[nbt={Health:0.0f}] add respawned
tag @a[nbt={Health:0.0f}] add respawned_rule

# 鞘翅
execute in bingolobby:lobby if block 0 73 0 red_mushroom_block run item replace entity @e[type=player,tag=respawned] armor.chest with minecraft:elytra{Unbreakable:1,Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]}
# 烟花火箭
execute in bingolobby:lobby if block 0 64 0 diamond_block run item replace entity @e[type=player,tag=respawned] inventory.0 with minecraft:firework_rocket{Fireworks:{Flight:2},Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 64
# 速度靴子
execute in bingolobby:lobby if block 0 72 0 white_wool run item replace entity @e[type=player,tag=respawned] armor.feet with minecraft:leather_boots{Enchantments:[{id:"minecraft:depth_strider", lvl: 3}, {id:"minecraft:vanishing_curse",lvl:1}], AttributeModifiers: [{Name:"generic.movement_speed",AttributeName:"generic.movement_speed",Operation:2,Amount:0.3,Slot:"feet",UUID:[I;1498693494,1027158888,1898994005,860320107]}], Unbreakable: true}
# 生物群系指南针
execute in bingolobby:lobby if block 0 74 0 oak_log run item replace entity @e[type=player,tag=respawned] inventory.9 with naturescompass:naturescompass{Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 1
# 结构指南针
execute in bingolobby:lobby if block 0 75 0 cracked_stone_bricks run item replace entity @e[type=player,tag=respawned] inventory.10 with explorerscompass:explorerscompass{Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 1
# 玩家追踪指南针
execute in bingolobby:lobby if block 0 76 0 reinforced_deepslate run item replace entity @e[type=player,tag=respawned] inventory.11 with playertrackingcompass:tracking_compass{Enchantments:[{id:"minecraft:vanishing_curse",lvl:1}]} 1

# 清除
effect clear @a[tag=respawned_rule]
# 夜视
execute in bingolobby:lobby if block 0 70 0 amethyst_block run effect give @a[tag=respawned_rule] night_vision infinite 0 true

tag @e[type=player,tag=respawned] remove respawned
