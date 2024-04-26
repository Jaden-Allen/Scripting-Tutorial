import { Block, BlockPermutation, Direction, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
import {Vector3} from "./@jadenallen/math_utils/index.js";

system.afterEvents.scriptEventReceive.subscribe((event) =>{
    if (event.id == "ja:cable_ticking"){
        ConnectCables(event.sourceBlock);
    }
})

const Checks = [
    {
        ThisFace : "ja:top",
        OtherFace : "ja:bottom",
        Direction : Vector3.Up()
    },
    {
        ThisFace : "ja:bottom",
        OtherFace : "ja:top",
        Direction : Vector3.Down()
    },
    {
        ThisFace : "ja:east",
        OtherFace : "ja:west",
        Direction : Vector3.Right()
    },
    {
        ThisFace : "ja:west",
        OtherFace : "ja:east",
        Direction : Vector3.Left()
    },
    {
        ThisFace : "ja:north",
        OtherFace : "ja:south",
        Direction : Vector3.Back()
    },
    {
        ThisFace : "ja:south",
        OtherFace : "ja:north",
        Direction : Vector3.Forward()
    }
]

function ConnectCables(/**@type {Block}*/block){
    let thisStates = block.permutation.getAllStates();

    Checks.forEach(check =>{
        let otherBlock = block.dimension.getBlock(Vector3.add(block.location, check.Direction));

        if (otherBlock == undefined) {
            thisStates[check.ThisFace] = false;
        }
        else if (otherBlock.typeId != block.typeId) {
            thisStates[check.ThisFace] = false;
        }
        else{
            let otherStates = otherBlock.permutation.getAllStates();
            otherStates[check.OtherFace] = true;
            thisStates[check.ThisFace] = true;
            otherBlock.setPermutation(BlockPermutation.resolve(otherBlock.typeId, otherStates));
        }
        
    })

    block.setPermutation(BlockPermutation.resolve(block.typeId, thisStates));
}