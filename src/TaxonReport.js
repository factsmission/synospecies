
export default class TaxonReport {

    constructor(taxaManager, element) {
        this._element = element;
        element.innerHTML = "";
        this._taxaManager = taxaManager;
    }
    
}
