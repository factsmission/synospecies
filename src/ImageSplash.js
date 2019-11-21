export default class ImageSplash {

    constructor(taxaManager, element) {
        this._element = element;
        element.innerHTML = "<div>Taxon images</div>";
        element.classList.remove("hide");
        this._taxaManager = taxaManager;
        this.addedImages = {};
    }

    appendImages(taxon) {
        this._taxaManager.getImages(taxon).then(images => {
            var template = $('#imageTpl').html();
            images.forEach(image => {
                if (!this.addedImages[image.url]) {
                    this.addedImages[image.url] = true;
                    var html = Mustache.to_html(template, image);
                    this._element.innerHTML += html;
                }
            });
        });
    }

    reset() {
        this._element.innerHTML = "";
        this.addedImages = {};
    };
}