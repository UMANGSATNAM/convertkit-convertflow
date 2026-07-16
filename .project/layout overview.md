---
title: Layouts
description: 'Learn about theme layouts, their role in a theme, and their requirements.'
source_url:
  html: 'https://shopify.dev/docs/storefronts/themes/architecture/layouts'
  md: 'https://shopify.dev/docs/storefronts/themes/architecture/layouts.md'
---

# Layouts

Layouts are the base of the theme, through which all [templates](https://shopify.dev/docs/storefronts/themes/architecture/templates) are rendered.

Layouts are Liquid files that allow you to include content, that should be repeated on multiple page types, in a single location. For example, layouts are a good place to include any content you might want in your `<head>` element, as well as headers and footers.

You can edit the default `theme.liquid` layout, or you can create multiple custom layout files to suit your needs. You can specify which layout to use, or whether to use a layout at all, at the template level:

* In JSON templates, the layout that's used to render a page is specified using [the `layout` attribute](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates#schema).

* In Liquid templates, the layout that's used to render a page is specified using [the `layout` Liquid tag](https://shopify.dev/docs/api/liquid/tags/layout).

![Diagram of theme architecture components with the layout highlighted.](https://shopify.dev/assets/assets/images/themes/architecture/layout-BK6bxAJ8.png)

***

## Location

Layout files are located in the `layout` directory of the theme:

```text
└── theme
  ├── layout
  |   ├── theme.liquid
  |   ...
  ├── templates
  ...
```

***

## Subtypes

There are the following layout types:

| Type | Description |
| - | - |
| **General** | General layouts can apply to all non-checkout pages. The default layout file, which must be included in all themes, is `theme.liquid`. |
| **Checkout** | This layout type applies to all checkout pages. It's available to [Shopify Plus](https://www.shopify.com/plus?utm_source=shopify\&utm_medium=docs\&utm_campaign=checkout_liquid_layout) merchants only. To learn more about this layout, refer to [checkout.liquid](https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid). |

***

## Schema

Because layout files are the base of the theme, they should follow the structure of a [standard HTML document](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure) in most cases. Most layout files also contain the following Liquid objects:

* [content\_for\_header](#content_for_header)
* [content\_for\_layout](#content_for_layout)

## basic\_layout\_example.liquid

```liquid
<!DOCTYPE html>
<html>
  <head>
    ...
    {{ content_for_header }}
    ...
  </head>


  <body>
    ...
    {{ content_for_layout }}
    ...
  </body>
 </html>
```

***

## Content

Layouts allow you to include content that's repeated across multiple page types in a single location. For example, layouts might include header and footer [sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) and [SEO metadata](https://shopify.dev/docs/storefronts/themes/seo/metadata).

Layout files are `.liquid` files, so content can be built using standard HTML and Liquid.

Layouts can access any [global Liquid objects](https://shopify.dev/docs/api/liquid/objects) and can contain the following Liquid objects:

* [content\_for\_header](#content_for_header)
* [content\_for\_layout](#content_for_layout).

**Caution:**

These objects are required in `theme.liquid`. If references to these objects aren't included, then you can't save or update the file using the code editor or tools like Shopify CLI.

### content\_​for\_​header

The `content_for_header` object is required in [`theme.liquid`](https://shopify.dev/docs/storefronts/themes/architecture/layouts). It must be placed inside the HTML `<head>` tag. It dynamically loads all scripts required by Shopify into the document head. These scripts are required for features like hCaptcha, Shopify apps, and more.

You shouldn't try to modify or parse the `content_for_header` object. If `content_for_header` changes, then the behavior of your Liquid will change.

### content\_​for\_​layout

The `content_for_layout` object dynamically outputs the content for each [template](https://shopify.dev/docs/storefronts/themes/architecture/templates). You need to add a reference to this object between the `<body>` and `</body>` HTML tags.

***

## Usage

When working with layout files, you should familiarize yourself with the following concepts:

* [Supporting template-specific CSS selectors](#support-template-specific-css-selectors)
* [Accessing and customizing checkout.liquid](#access-and-customize-checkout-liquid)

### Support template-specific CSS selectors

You can help create CSS rules for specific templates by outputting data from the [`template` object](https://shopify.dev/docs/api/liquid/objects/template) in the `<body>` tag's class.

## Template-specific CSS selector

## theme.liquid

```liquid
<body className="template-{{ template.name }}">
  ...
</body>
```

## theme.css

```css
.template-product {
  margin-bottom: 2em;
}
```

### Access and customize checkout.​liquid

**Deprecated:**

`checkout.liquid` is now unsupported for the Information, Shipping, and Payment checkout steps. `checkout.liquid`, additional scripts, and script tags are deprecated for the **Thank you** and **Order status** pages and will be sunset on August 28, 2025.

Stores that currently use `checkout.liquid` for the **Thank you** and **Order status** pages need to [upgrade to Shopify Extensions in Checkout](https://www.shopify.com/checkout#advanced-customizations) before the deadline.

[Shopify Scripts](https://shopify.dev/docs/api/liquid/objects#script) will continue to work alongside Shopify Extensions in Checkout until June 30, 2026.

Learn [how to build checkout extensions](https://shopify.dev/docs/apps/build/checkout/technologies) that extend the functionality of Shopify checkout.

To enable or disable access to `checkout.liquid`, Shopify Plus merchants must [contact support](https://help.shopify.com/en/questions#/contact). To learn more about enabling access, refer to [Access checkout.liquid](https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid#access-checkout-liquid).

Before making any customizations, you should refer to [checkout.liquid](https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid) to familiarize yourself with the file format and contents, as well as [Best practices for editing checkout.liquid](https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid/customize-checkout).

***