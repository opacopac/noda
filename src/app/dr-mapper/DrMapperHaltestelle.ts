import {Haltestelle} from '../model/Haltestelle';
import {Position2d} from '../model/Position2d';

export class DrMapperHaltestelle {
    private constructor() {}


    public static createHaltestelle(hstNode: Element): Haltestelle {
        return new Haltestelle(
            hstNode.attributes[0].value,
            parseInt(hstNode.children[0].children[3].innerHTML, 10),
            hstNode.children[0].children[0].innerHTML,
            new Position2d(
                parseInt(hstNode.children[0].children[2].innerHTML, 10),
                parseInt(hstNode.children[0].children[1].innerHTML, 10)
            )
        );
    }
}
