import {Haltestelle} from './haltestelle';
import {Kante} from './kante';
import {Zone} from './zone';
import {Zonenplan} from './zonenplan';
import {Lokalnetz} from './lokalnetz';
import {Relationsgebiet} from './relationsgebiet';


export class DrData {
    constructor(
        public drId: string,
        public haltestellen: Map<string, Haltestelle>,
        public kanten: Map<string, Kante>,
        public zonen: Map<string, Zone>,
        public lokalnetze: Map<string, Lokalnetz>,
        public zonenplaene: Map<string, Zonenplan>,
        public relationsgebiete: Map<string, Relationsgebiet>
    ) {
    }
}
