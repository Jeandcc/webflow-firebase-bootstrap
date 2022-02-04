import DomUtils from './Dom';

export default class VueUtils {
  public static fixWebflowAttributes() {
    let templatesContainer = $('.templates,.w_templates');

    // If no templates container found, create a new one
    if (!templatesContainer.length) {
      templatesContainer = $('<div class="w_templates"></div>');
    }

    // Move to bottom of body so it doesn't remain inside any Vue App Container
    templatesContainer.appendTo('body');

    // Remove all style tags and templates from inside Vue App Containers
    $('style').appendTo(templatesContainer);
    $('[data-v-template]').appendTo(templatesContainer);

    // Fix for Webflow not allowing custom HTML tags with its building blocks
    DomUtils.replaceTagOfElements($('[data-v-link]'), '<router-link>', true);

    document.querySelectorAll("[href='#']").forEach(el => {
      el.removeAttribute('href');
    });

    document.querySelectorAll('[v-bind\\:src]').forEach(el => {
      el.removeAttribute('src');
      el.removeAttribute('srcset');
    });

    document.querySelectorAll('[v-bind\\:data-w-tab]').forEach(el => {
      el.removeAttribute('data-w-tab');
    });

    document.querySelectorAll('[v-bind\\:href]').forEach(el => {
      el.removeAttribute('href');
    });

    document.querySelectorAll('[v-bind\\:data-name]').forEach(el => {
      el.removeAttribute('data-name');
    });

    // Fix for webflow not allowing "ref" attribute
    document.querySelectorAll('[v-ref]').forEach(el => {
      el.setAttribute('ref', el.getAttribute('v-ref') || '');
      el.removeAttribute('v-ref');
    });

    document.querySelectorAll('[v-cloak-live]').forEach(el => {
      el.setAttribute('v-cloak', 'true');
      el.removeAttribute('v-cloak-live');
    });

    document.querySelectorAll('[v-fade]').forEach(el => {
      $(el).wrap('<transition name="fade"></transition>');
      el.removeAttribute('v-fade');
    });

    document.querySelectorAll('[v-fade-out-in]').forEach(el => {
      $(el).wrapInner('<transition name="fade" mode="out-in"></transition>');
      el.removeAttribute('v-fade-out-in');
    });
  }
}
