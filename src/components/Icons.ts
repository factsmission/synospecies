import { css, html, LitElement } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { customElement, property } from "lit/decorators.js";

const icon = {
  def:
    '<path fill="#388e3c" d="M444-288h72v-156h156v-72H516v-156h-72v156H288v72h156v156Zm36.28 192Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/>',
  aug:
    '<path fill="#1e88e5" d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/>',
  dpr:
    '<path fill="#e53935" d="m339-288 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Z"/>',
  cite:
    '<path fill="#666666" d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/>',
  multiple:
    '<path fill="#666666" d="M288-420q25 0 42.5-17.5T348-480q0-25-17.5-42.5T288-540q-25 0-42.5 17.5T228-480q0 25 17.5 42.5T288-420Zm192 0q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm192 0q25 0 42.5-17.5T732-480q0-25-17.5-42.5T672-540q-25 0-42.5 17.5T612-480q0 25 17.5 42.5T672-420ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/>',
  unknown:
    '<path fill="#666666" d="M480-240q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm-36-153h73q0-37 6.5-52.5T555-485q35-34 48.5-58t13.5-53q0-55-37.5-89.5T484-720q-51 0-88.5 27T343-620l65 27q9-28 28.5-43.5T482-652q28 0 46 16t18 42q0 23-15.5 41T496-518q-35 32-43.5 52.5T444-393Zm36 297q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/>',

  def_dpr:
    `<path fill="#e53935" d="M 552.46094 -864 C 540.28135 -864 528.28991 -863.40865 516.44727 -862.35352 C 556.10993 -858.81486 593.809 -849.40619 629.5 -834 C 675.83333 -814 716.5 -786.5 751.5 -751.5 C 786.5 -716.5 814 -675.7593 834 -629.2793 C 854 -582.79263 864 -533.12597 864 -480.2793 C 864 -427.42597 854 -377.66667 834 -331 C 814 -284.33333 786.5 -243.5 751.5 -208.5 C 716.5 -173.5 675.7593 -146 629.2793 -126 C 593.50023 -110.60674 555.81809 -101.19993 516.27148 -97.654297 C 528.11686 -96.59328 540.10571 -96 552.2793 -96 C 605.12597 -96 654.79263 -106 701.2793 -126 C 747.7593 -146 788.5 -173.5 823.5 -208.5 C 858.5 -243.5 886 -284.33333 906 -331 C 926 -377.66667 936 -427.42597 936 -480.2793 C 936 -533.12597 926 -582.79263 906 -629.2793 C 886 -675.7593 858.5 -716.5 823.5 -751.5 C 788.5 -786.5 747.83333 -814 701.5 -834 C 655.16667 -854 605.48761 -864 552.46094 -864 z"/>
    <path fill="#388e3c" "m 372,-288 h 72 v -156 h 156 v -72 H 444 v -156 h -72 v 156 H 216 v 72 h 156 z m 36.28,192 Q 329,-96 259,-126 189,-156 136.5,-208.5 84,-261 54,-330.96 24,-400.92 24,-480.46 24,-560 54,-629.5 84,-699 136.5,-751.5 189,-804 258.96,-834 q 69.96,-30 149.5,-30 79.54,0 149.04,30 69.5,30 122,82.5 52.5,52.5 82.5,122.22 30,69.73 30,149 0,79.28 -30,149.28 -30,70 -82.5,122.5 -52.5,52.5 -122.22,82.5 -69.73,30 -149,30 z"/>`,
  aug_dpr:
    `<path fill="#e53935" d="M 552.46094 -864 C 540.28135 -864 528.28991 -863.40865 516.44727 -862.35352 C 556.10993 -858.81486 593.809 -849.40619 629.5 -834 C 675.83333 -814 716.5 -786.5 751.5 -751.5 C 786.5 -716.5 814 -675.7593 834 -629.2793 C 854 -582.79263 864 -533.12597 864 -480.2793 C 864 -427.42597 854 -377.66667 834 -331 C 814 -284.33333 786.5 -243.5 751.5 -208.5 C 716.5 -173.5 675.7593 -146 629.2793 -126 C 593.50023 -110.60674 555.81809 -101.19993 516.27148 -97.654297 C 528.11686 -96.59328 540.10571 -96 552.2793 -96 C 605.12597 -96 654.79263 -106 701.2793 -126 C 747.7593 -146 788.5 -173.5 823.5 -208.5 C 858.5 -243.5 886 -284.33333 906 -331 C 926 -377.66667 936 -427.42597 936 -480.2793 C 936 -533.12597 926 -582.79263 906 -629.2793 C 886 -675.7593 858.5 -716.5 823.5 -751.5 C 788.5 -786.5 747.83333 -814 701.5 -834 C 655.16667 -854 605.48761 -864 552.46094 -864 z"/>
    <path fill="#1e88e5" d="m 408.28,-96 c -52.85333,0 -102.61333,-10 -149.28,-30 -46.66667,-20 -87.5,-47.5 -122.5,-82.5 -35,-35 -62.5,-75.82 -82.5,-122.46 -20,-46.64 -30,-96.47333 -30,-149.5 0,-53.02667 10,-102.70667 30,-149.04 20,-46.33333 47.5,-87 82.5,-122 35,-35 75.82,-62.5 122.46,-82.5 46.64,-20 96.47333,-30 149.5,-30 53.02667,0 102.70667,10 149.04,30 46.33333,20 87,47.5 122,82.5 35,35 62.5,75.74 82.5,122.22 20,46.48667 30,96.15333 30,149 0,52.85333 -10,102.61333 -30,149.28 -20,46.66667 -47.5,87.5 -82.5,122.5 -35,35 -75.74,62.5 -122.22,82.5 -46.48667,20 -96.15333,30 -149,30 z"/>`,

  col_aug:
    '<path fill="#1e88e5" d="m429-336 238-237-51-51-187 186-85-84-51 51 136 135ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/>',
  col_dpr:
    '<path fill="#e53935" d="m350-300 129.77-129.77L609.53-300 660-350.47 530.23-480.23 660-610l-50-50-129.77 129.77L350.47-660 300-609.53l129.77 129.76L300-350l50 50ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/>',

  link:
    '<path fill="currentcolor" d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z"/>',

  expand:
    '<path fill="currentcolor" d="M240-240v-240h72v168h168v72H240Zm408-240v-168H480v-72h240v240h-72Z"/>',
  collapse:
    '<path fill="currentcolor" d="M432-432v240h-72v-168H192v-72h240Zm168-336v168h168v72H528v-240h72Z"/>',

  east:
    '<path fill="currentcolor" d="m600-216-51-51 177-177H96v-72h630L549-693l51-51 264 264-264 264Z"/>',
  west:
    '<path fill="currentcolor" d="M360-216 96-480l264-264 51 51-177 177h630v72H234l177 177-51 51Z"/>',
  empty: '<path fill="currentcolor" d=""/>',

  Plantae:
    `<path fill="#666666" d="M444-144v-297h-9q-56.97 0-109.48-21.5Q273-484 232-524q-42.58-41.23-65.29-95.3Q144-673.36 144-732v-84h84q57 0 109 21.5t93 61.5q29 28 48.5 62.5T508-598q38-53 98-81.5T732-708h84v84q0 58.73-22.5 112.86Q771-457 728-416q-40 35-88.8 54-48.81 19-102.2 19h-21v199h-72Zm0-372q0-46-15.5-89.5T381-681q-32-32-75.5-47.5T216-744q0 46 15.5 89.5T279-579q32 32 75.5 47.5T444-516Zm72 108q46 0 89.5-15.5T681-471q32-32 47.5-75.5T744-636q-46 0-89.5 15.5T579-573q-32 32-47.5 75.5T516-408Zm0 0Zm-72-108Z"/>`,
  Animalia:
    `<path fill="#666666" d="M468-144q-83.75 0-145.88-54.5Q260-253 252-336q-67-13-111.5-63T96-517q0-76 57-127.5T288-696h96q9.6 0 16.8-7.2 7.2-7.2 7.2-16.8 0-9.6-7.2-16.8-7.2-7.2-16.8-7.2h-60q-15.3 0-25.65-10.29Q288-764.58 288-779.79t10.35-25.71Q308.7-816 324-816h60q40.32 0 68.16 27.77 27.84 27.78 27.84 68Q480-680 452.16-652q-27.84 28-68.16 28h-96q-48 0-84 30t-36 76.8q0 38.2 24.5 68.2t62.5 41q23-89 84.5-128.5T465-576q20 0 44.5 4.5T548-559q9-5 18.5-8t19-5q9.5-2 19.17-3 9.66-1 19.33-1 70 0 119 50t49 121v12l29 27q20 18 31.5 42.61 11.5 24.6 11.5 51.53Q864-218 825.55-181q-38.44 37-92.55 37H468Zm0-72h264.66q24.34 0 41.84-16.64 17.5-16.64 17.5-39.47 0-12.36-5-22.82T773-313l-61-56q4-9 6-18.75t2-20.25q0-40-27.77-68-27.78-28-68-28Q584-504 556-476.21q-28 27.79-28 68.04 0 19.17 6.52 36.22Q541.03-354.9 555-342l-50 51q-25-21-37-51.42T456-405q0-26 7-51.5t24-45.5q-5-2-11-2h-11q-54 0-98.5 39.5T322-361.33q0 32.33 12.5 58.83t33 46q20.5 19.5 46.5 30t54 10.5Zm205.21-41q-15.21 0-25.71-10.29t-10.5-25.5q0-15.21 10.29-25.71t25.5-10.5q15.21 0 25.71 10.29t10.5 25.5q0 15.21-10.29 25.71t-25.5 10.5ZM624-408Z"/>`,
};

export type IconName = keyof typeof icon;

@customElement("s-icon")
export class Icon extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      height: 1rem;
    }
    svg {
      display: block;
      height: 100%;
      margin: 0;
    }
  `;

  // Declare reactive properties
  @property()
  accessor icon: IconName = "unknown";

  // Render the UI as a function of component state
  override render() {
    return html`<svg viewBox="0 -960 960 960">${
      unsafeSVG(icon[this.icon])
    }</svg>`;
  }
}

export const icons = {
  def:
    `<svg class="green" viewBox="0 -960 960 960"><path fill="currentcolor" d="M444-288h72v-156h156v-72H516v-156h-72v156H288v72h156v156Zm36.28 192Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/></svg>`,
  aug:
    `<svg class="blue" viewBox="0 -960 960 960"><path fill="currentcolor" d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/></svg>`,
  dpr:
    `<svg class="red" viewBox="0 -960 960 960"><path fill="currentcolor" d="m339-288 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Z"/></svg>`,
  cite:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentcolor" d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>`,
  unknown:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentcolor" d="M480-240q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm-36-153h73q0-37 6.5-52.5T555-485q35-34 48.5-58t13.5-53q0-55-37.5-89.5T484-720q-51 0-88.5 27T343-620l65 27q9-28 28.5-43.5T482-652q28 0 46 16t18 42q0 23-15.5 41T496-518q-35 32-43.5 52.5T444-393Zm36 297q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>`,

  col_aug:
    `<svg class="blue" viewBox="0 -960 960 960"><path fill="currentcolor" d="m429-336 238-237-51-51-187 186-85-84-51 51 136 135ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/></svg>`,
  col_dpr:
    `<svg class="red" viewBox="0 -960 960 960"><path fill="currentcolor" d="m350-300 129.77-129.77L609.53-300 660-350.47 530.23-480.23 660-610l-50-50-129.77 129.77L350.47-660 300-609.53l129.77 129.76L300-350l50 50ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/></svg>`,

  link:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentColor" d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z"/></svg>`,

  expand:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentColor" d="M240-240v-240h72v168h168v72H240Zm408-240v-168H480v-72h240v240h-72Z"/></svg>`,
  collapse:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentColor" d="M432-432v240h-72v-168H192v-72h240Zm168-336v168h168v72H528v-240h72Z"/></svg>`,

  east:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentColor" d="m600-216-51-51 177-177H96v-72h630L549-693l51-51 264 264-264 264Z"/></svg>`,
  west:
    `<svg class="gray" viewBox="0 -960 960 960"><path fill="currentColor" d="M360-216 96-480l264-264 51 51-177 177h630v72H234l177 177-51 51Z"/></svg>`,
  empty: `<svg viewBox="0 -960 960 960"></svg>`,
};
