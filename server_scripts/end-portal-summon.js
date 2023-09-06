(() => {
	let SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
	let SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
	let endPortalChance = 40

	function RandomGenerator(seed) {
		this.seed = seed
		this.multiplier = 2371
		this.increment = 537283
		this.modulo = 131071
		
		this.iterate = function(mix) {
			this.seed = (this.seed + mix) % this.modulo
			this.seed = this.seed ^ (this.seed << 1)
			this.seed %= this.modulo
			this.seed = this.seed * this.multiplier + this.increment
			this.seed %= this.modulo
		}
		this.generate = function() {
			this.iterate(0)
			return this.seed
		}
		this.iterate(0)
	}
	
	function getChunkPos(blockpos) {
		return [Math.floor(blockpos.getX() / 16), Math.floor(blockpos.getZ() / 16)]
	}
	function getInChunkPos(blockpos) {
		return [Math.floor(blockpos.getX() % 16), Math.floor(blockpos.getZ() % 16)]
	}
	function isEndPortalChunk(seed, chunkpos) {
		let rng = new RandomGenerator(seed)
		rng.iterate(chunkpos[0])
		rng.iterate(chunkpos[1])
		let mod = rng.generate() % endPortalChance
		return mod == 0
	}
	function getPortalPos(seed, chunkpos) { // 生成传送门侯选位置（只有第一个是真的）
		let rng = new RandomGenerator(seed)
		rng.iterate(chunkpos[0])
		rng.iterate(chunkpos[1])
		let ret = []
		let trials = 0
		while(ret.length < 6) {
			rng.iterate(ret.length + 1)
			let generated = [rng.generate() % 12 + 2, rng.generate() % 12 + 2]
			let ok = true
			for(let prevPos of ret) {
				let dist = ((prevPos[0] - generated[0]) ** 2) + ((prevPos[1] - generated[1]) ** 2)
				if(dist < (2.5 ** 2)) {
					ok = false
					break
				}
			}
			trials += 1
			if(trials > 1000) {
				break
			}
			if(!ok) {
			 	continue
			}
			ret.push(generated)
		}
		let tr = []
		for(let inpos of ret) {
			tr.push([chunkpos[0] * 16 + inpos[0], chunkpos[1] * 16 + inpos[1]])
		}
		return tr
	}

	BlockEvents.rightClicked(event => {
		let { player, block, item } = event
		let server = event.getServer()
		let level = event.getLevel()
		let dimensionId = level.getDimension()
		let itemId = item.getItem().getId()
		let blockId = block.getId()
		let seed = level.getSeed()
		
		if(itemId != 'minecraft:ender_eye' || dimensionId != 'minecraft:overworld') {
			return
		}
		
		let chunkPos = getChunkPos(block.pos)
		let inChunkPos = getInChunkPos(block.pos)
		let playerName = player.getProfile().name
		let blockPosName = block.pos.getX() + ' ' + block.pos.getY() + ' ' + block.pos.getZ()
		
		if(blockId == 'minecraft:dirt') {
			server.runCommandSilent(`playsound minecraft:block.gravel.break block ${playerName} ${blockPosName}`)
			// 第一步：地面上定位区块
			if(isEndPortalChunk(seed, chunkPos)) {
				server.runCommandSilent(`setblock ${blockPosName} minecraft:spawner`)
			} else {
				server.runCommandSilent(`setblock ${blockPosName} minecraft:coarse_dirt`)
			}
		} else if(blockId == 'minecraft:deepslate' && block.pos.getY() <= 8 && block.pos.getY() > -63) {
			// 第二步：挖到有深板岩的区域，点击深板岩清空区域
			if(isEndPortalChunk(seed, chunkPos)) {
				server.runCommandSilent(`playsound minecraft:block.stone.break block ${playerName} ${blockPosName}`)
				let minX = chunkPos[0] * 16
				let maxX = chunkPos[0] * 16 + 15
				let minZ = chunkPos[1] * 16
				let maxZ = chunkPos[1] * 16 + 15
				let minY = block.pos.getY() - 1
				let maxY = block.pos.getY() + 7
				let flagBlock = level.getBlock(minX, -64, minZ)
				if(flagBlock.getId() == 'minecraft:barrier') {
					return
				}
				server.runCommandSilent(`fill ${minX-1} ${minY} ${minZ-1} ${maxX+1} ${maxY} ${maxZ+1} stone_bricks`)
				server.runCommandSilent(`fill ${minX} ${minY} ${minZ} ${maxX} ${maxY} ${maxZ} air`)
				server.runCommandSilent(`fill ${minX} ${minY} ${minZ} ${maxX} ${minY} ${maxZ} stone_bricks`)
				server.runCommandSilent(`fill ${minX} ${maxY} ${minZ} ${maxX} ${maxY} ${maxZ} stone_bricks`)
				server.runCommandSilent(`setblock ${minX} ${-64} ${minZ} barrier`) // 标记位，防止反复清空
				
				server.runCommandSilent(`advancement grant ${playerName} only minecraft:story/follow_ender_eye`)
				
				let targetY = minY + 1
				let targetPos = getPortalPos(seed, chunkPos)
				for(let pos of targetPos) {
					server.runCommandSilent(`setblock ${pos[0]} ${targetY} ${pos[1]} reinforced_deepslate`)
				}
			}
		} else if(blockId == 'minecraft:reinforced_deepslate') {
			// 第三步：召唤传送门
			if(isEndPortalChunk(seed, chunkPos)) {
				let targetPos = getPortalPos(seed, chunkPos)[0]
				server.runCommandSilent(`playsound minecraft:block.stone.break block ${playerName} ${blockPosName}`)
				
				if(block.pos.getX() != targetPos[0] || block.pos.getZ() != targetPos[1]) {
					server.runCommandSilent(`setblock ${blockPosName} minecraft:spawner`)
				} else {
					let x = block.pos.getX()
					let y = block.pos.getY()
					let z = block.pos.getZ()
					
					server.runCommandSilent(`fill ${x-2} ${y} ${z-2} ${x+2} ${y} ${z+2} stone_bricks`)
					server.runCommandSilent(`fill ${x-1} ${y} ${z-1} ${x+1} ${y} ${z+1} lava`)
					
					let deltas = [
						{facing: 'east', x: -2, z: -1},
						{facing: 'east', x: -2, z: 0},
						{facing: 'east', x: -2, z: 1},
						{facing: 'west', x: 2, z: -1},
						{facing: 'west', x: 2, z: 0},
						{facing: 'west', x: 2, z: 1},
						{facing: 'south', x: -1, z: -2},
						{facing: 'south', x: 0, z: -2},
						{facing: 'south', x: 1, z: -2},
						{facing: 'north', x: -1, z: 2},
						{facing: 'north', x: 0, z: 2},
						{facing: 'north', x: 1, z: 2},
					]
					
					let rng = new RandomGenerator(seed)
					rng.iterate(x)
					rng.iterate(y)
					rng.iterate(z)
					rng.iterate(114514)
					for(let item of deltas) {
						let eyeState = (rng.generate() % 10 == 0) ? 'true' : 'false'
						server.runCommandSilent(`setblock ${x+item.x} ${y+2} ${z+item.z} end_portal_frame[facing=${item.facing},eye=${eyeState}]`)
					}
				}
			}
		}
	})
	EntityEvents.spawned(event => {
		let { entity } = event
		if(entity.getType() == 'minecraft:eye_of_ender') {
			if(Math.random() < 0.96) {
				entity.spawnAtLocation(Item.of('minecraft:ender_eye'))
			} else {
				let soundEvent = SoundEvents.ENDER_EYE_DEATH
				entity.playSound(soundEvent)
			}
			event.cancel()
		}
	})
})()
