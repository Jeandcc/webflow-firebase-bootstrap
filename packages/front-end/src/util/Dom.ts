export default class DomUtils {
  public static replaceTagOfElements(
    $elements: JQuery,
    newHTMLTag: string,
    keepProps?: boolean,
  ) {
    const $newHTMLTag = $(newHTMLTag);

    $elements.each((_, el) => {
      const $el = $(el);
      const $newEl = $($newHTMLTag).clone();

      if (keepProps) {
        const newTag = $newEl[0];
        newTag.className = el.className;
        const attributes = $el.prop('attributes');
        $.each(attributes, function setNewElAttribute() {
          $newEl.attr(this.name, this.value);
        });
      }

      $el.wrapAll($newEl);
      $el.contents().unwrap();
    });
  }
}
