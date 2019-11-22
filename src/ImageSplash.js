export default class ImageSplash {

    constructor(taxaManager, element) {
        this._element = element;
        element.innerHTML = "<div>Taxon images</div>";
        element.classList.remove("hide");
        this._taxaManager = taxaManager;
        this.addedImages = {};
        this.template = `
        <figure>
            <img src="{{url}}" alt="{{description}}" style="width:100%; max-width:600px;" />
            <figcaption>{{description}}</figcaption>
        </figure>
        `;
    }

    appendImages(taxon) {
        this._taxaManager.getImages(taxon).then(images => {
            images.forEach(image => {
                if (!this.addedImages[image.url]) {
                    this.addedImages[image.url] = true;
                    var html = Mustache.to_html(this.template, image);
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