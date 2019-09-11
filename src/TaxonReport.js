
export default class TaxonReport {

    constructor(taxaManager, element) {
        this._element = element;
        element.innerHTML = "<div>PLAZI Taxon Report</div>";
        element.classList.remove("hide");
        this._taxaManager = taxaManager;
    }
    
}
