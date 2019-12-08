export default class ImageSplash {

    constructor(taxaManager, element) {
        this._element = element;
        this._taxaManager = taxaManager;
        this.addedImages = {};
        this.to_html = (image) => {
            const desc = image.description || '';
            const figure = document.createElement('figure');
            const img = document.createElement('img');
                  img.setAttribute('src', image.url);
                  img.setAttribute('alt', desc);
            const figcaption = document.createElement('figcaption')
            if (desc.length > 400) {
                figcaption.innerHTML = desc.slice(0, 401) + '<span hidden aria-hidden="false">' + desc.slice(401) + '</span>';
                const expandbtn = document.createElement("span");
                      expandbtn.innerHTML = "...";
                      expandbtn.classList.add("expandbtn");
                      expandbtn.addEventListener("click", e => {
                        figcaption.innerHTML = desc;
                        e.preventDefault();
                      });
                figcaption.append(expandbtn);
            } else {
                figcaption.textContent = desc;
            }
            figure.append(img);
            figure.append(figcaption);
            return figure;
        };
    }

    appendImages(taxon) {
        this._taxaManager.getImages(taxon).then(images => {
            images.forEach(image => {
                if (!this.addedImages[image.url]) {
                    this.addedImages[image.url] = true;
                    this._element.append(this.to_html(image));
                }
            });
            if (Object.keys(this.addedImages).length === 1) {
                this._element.classList.add('twocol')
            } else if (Object.keys(this.addedImages).length <= 3) {
                this._element.classList.add('threecol')
            }
        });
    }

    reset() {
        this._element.innerHTML = "";
        this._element.classList.remove('twocol')
        this._element.classList.remove('threecol')
        this.addedImages = {};
    };
}