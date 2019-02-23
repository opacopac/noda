export class NovaDrNsResolver implements XPathNSResolver {
    lookupNamespaceURI(prefix: string): string {
        switch (prefix) {
            case 'ns2':
                return 'ch.voev.nova.pflege.common.exporter.datenrelease';
            case 'ns3':
                return 'ch.voev.nova.pflege.common.exporter.datenrelease.tarifcommons';
            case 'ns4':
                return 'http://www.w3.org/2001/XMLSchema-instance';
            case 'ns5':
                return 'ch.voev.nova.pflege.common.exporter.datenrelease.dvmodell';
            case 'ns6':
                return 'ch.voev.nova.pflege.common.exporter.datenrelease.netz';
            default :
                return undefined;
        }
    }
}
