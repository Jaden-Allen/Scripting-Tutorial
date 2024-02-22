import {world, Player, system} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

class ShopItem{
    Name = "";
    Price = 0;
    TypeId = "";

    constructor(Name, Price, TypeId){
        this.Name = Name;
        this.Price = Price;
        this.TypeId = TypeId;
    }
}

const ScoreboardName = "Money";
let objective;

const Diamond = new ShopItem("Diamond", 150, "minecraft:diamond");
const Gold = new ShopItem("Gold", 150, "minecraft:gold_ingot");
const Iron = new ShopItem("Iron", 150, "minecraft:iron_ingot");

const ShopItems = [Diamond, Gold, Iron];

world.afterEvents.worldInitialize.subscribe(()=>{
    objective = world.scoreboard.getObjective(ScoreboardName);

    if (!objective){
        objective = world.scoreboard.addObjective(ScoreboardName);
    }
})

world.afterEvents.itemUse.subscribe((event)=>{
    if (event.itemStack.typeId == "minecraft:book"){
        OpenForm(event.source);
    }
})

system.runInterval(()=>{
    let players = world.getPlayers({excludeTags: ["HasJoinedBefore"]});

    players.forEach(player =>{
        objective.setScore(player, 0);
        player.addTag("HasJoinedBefore");
    })
})

function OpenForm(/** @type {Player} */player){
    let form = new ActionFormData()
    form.title("Test form")
    form.body("This is the first sentance to the form!")
    
    for (let i = 0; i < ShopItems.length; i++){
        form
        form.button(ShopItems[i].Name + " - " + ShopItems[i].Price)
    }

    form.show(player).then(respone =>{
        if (respone.selection != -1){
            world.sendMessage("Button has been clicked!");
            PurchaseItem(respone.selection, player);
        }
    });
}

function PurchaseItem(index, player){
    if (objective.getScore(player) >= ShopItems[index].Price){
        objective.setScore(player, objective.getScore(player) - ShopItems[index].Price);
        player.runCommand("give @s " + ShopItems[index].TypeId)
    }
}