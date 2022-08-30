// // We're going to create a custom html tag that we can use to represent an escaped element
// export class EscapedElement extends HTMLElement {
//     sanitize = true;
//     sanitize_html = true;
//
//     original_content: string | null;
//
//     constructor() {
//         super();
//
//         this.original_content = this.textContent;
//
//         if (this.hasAttribute("sanitize")) {
//             this.sanitize = this.getAttribute("sanitize") === "true";
//         }
//         if (this.hasAttribute("sanitize-html")) {
//             this.sanitize_html = this.getAttribute("sanitize_html") === "true";
//         }
//
//         if (this.innerHTML) {
//             if (this.sanitize_html) {
//                 this.innerHTML = this.innerHTML.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
//             }
//
//             if (this.sanitize) {
//                 this.innerHTML = this.innerHTML.replace(/\n/g, "<br>");
//                 this.innerHTML = this.innerHTML.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
//                 if (this.sanitize_html)
//                     // Match all spaces that is not contained in a tag
//                     this.innerHTML = this.innerHTML.replace(/ (?![^<]*>)/g, " ");
//                 else
//                     this.innerHTML = this.innerHTML.replace(/ /g, "&nbsp;");
//             }
//         }
//     }
//
//     public toString() {
//         return `<escaped-element sanitize="${this.sanitize}" sanitize-html="${this.innerHTML}">${this.original_content}</escaped-element>`;
//     }
// }
//
// // Wait until DOM is ready to load the custom element
// // This shouldn't be a problem because the custom element is only used when the user starts typing
// // The user can't start typing until the DOM is ready anyway
// document.addEventListener('DOMContentLoaded', function () {
//     window.customElements.define("escaped-element", EscapedElement);
// });
