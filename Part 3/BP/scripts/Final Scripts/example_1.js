import { system, world } from "@minecraft/server";
import { Mathf } from "./@jadenallen/math_utils/index.js";

class Pool {
    /**@type {string}*/ typeId = "";
    /**@type {number}*/ weight = 0;
    /**@type {number}*/ minCount = 0;
    /**@type {number}*/ maxCount = 0;

    constructor(/**@type {string}*/ typeId, /**@type {number}*/ weight, /**@type {number}*/ minCount, /**@type {number}*/ maxCount){
        this.typeId = typeId;
        this.weight = weight;
        this.minCount = minCount;
        this.maxCount = maxCount;
    }
}
class LootTable{
    /**@type {number}*/ Rolls = 0;
    /**@type {Pool[]}*/ Items = [];

    constructor(/**@type {number}*/ Rolls, /**@type {Pool[]}*/ Items){
        this.Rolls = Rolls;
        this.Items = Items;
    }
}

const _LootTable = new LootTable(
    10,
    [
        new Pool(
            "minecraft:diamond",
            1,
            1,
            2
        ),
        new Pool(
            "minecraft:gold_ingot",
            3,
            2,
            4
        ),
        new Pool(
            "minecraft:iron_ingot",
            1,
            1,
            2
        ),
        new Pool(
            "minecraft:raw_copper",
            7,
            2,
            3
        ),
        new Pool(
            "minecraft:copper_ingot",
            7,
            5,
            6
        ),
        new Pool(
            "minecraft:raw_gold",
            7,
            6,
            7
        )
    ]
)

function GenerateLootTable(){

    let lt = new LootTable(_LootTable.Rolls, [])

    _LootTable.Items.forEach(item =>{
        for (let i = 0; i < item.weight; i++){
            lt.Items.push(item);
        }
    })

    return lt;
}

world.afterEvents.itemUse.subscribe((event) =>{
    if (event.itemStack.typeId == "minecraft:stick"){
        const LootTable = GenerateLootTable();

        for (let i = 0; i < LootTable.Rolls; i++){
            let itemIndex = Math.random() * LootTable.Items.length - 1;
            itemIndex = Math.round(itemIndex);

            let Item = LootTable.Items[itemIndex];

            let amount = Mathf.Lerp(Item.minCount, Item.maxCount, Math.random());
            amount = Math.round(amount);

            event.source.runCommand(`give @s ${Item.typeId} ${amount}`)
        }
    }
})

function Lerp(a, b, percent){
    return a + (b - a) * percent;
}