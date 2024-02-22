import {world} from "@minecraft/server";

world.afterEvents.itemUse.subscribe((event)=>{
    if (event.itemStack.typeId == "minecraft:stick"){
        let coords = event.source.location;
        let dir = event.source.getViewDirection();

        coords.x += (dir.x * 5);
        coords.y += (dir.y * 5);
        coords.z += (dir.z * 5);

        event.source.runCommandAsync("say " + coords.x + " " + coords.y + " " + coords.z);
        event.source.runCommandAsync("tp @e[type=!player] " + coords.x + " " + coords.y + " " + coords.z);
    }
})